import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const Kartta: React.FC = () => {
  const [ajot, setAjot] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([60.1695, 24.9354]);
  

  useEffect(() => {
    const haeAjot = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/ajot');
        const filteredAjot = response.data.filter((ajo: any) => ajo.lat !== null && ajo.lng !== null);
        setAjot(filteredAjot);
      } catch (error) {
        console.error('Virhe haettaessa ajotietoja:', error);
      }
    };
  
    haeAjot();
  }, []);

  const handleAddressClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
  };

const handleDelete = async (id: number) => {
  console.log('Poistettavan tiedon ID:', id); 

  try {
    await axios.delete(`http://localhost:8080/api/ajot/${id}`);
    setAjot(prevAjot => prevAjot.filter(ajo => ajo.id !== id)); // Poista poistettu ajo paikallisesta tilasta
  } catch (error) {
    console.error('Virhe poistettaessa ajoa:', error);
  }
};


return (
  <div>
    <MapContainer center={mapCenter} zoom={7} style={{ height: '500px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
      {ajot.map((ajo) => (
        <Marker key={ajo.id} position={[parseFloat(ajo.lat), parseFloat(ajo.lng)]} icon={customIcon}>
          <Popup>
            <div>
              <h2>{ajo.osoite}</h2>
              <p>Päivämäärä: {new Date(ajo.ajankohta).toLocaleDateString()}</p>
              <p>Asiakas: {ajo.asiakas}</p>
              <p>Yhteystiedot: {ajo.yhteystiedot}</p>
              <p>Lisätiedot: {ajo.lisatietoja}</p>
              <button onClick={() => handleDelete(ajo.id)}>Poista</button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {ajot.map((ajo) => (
        <div
          key={ajo.id}
          style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '5px', cursor: 'pointer' }}
          onClick={() => handleAddressClick(parseFloat(ajo.lat), parseFloat(ajo.lng))}
        >
          <h3>{ajo.osoite}</h3>
          <p>Päivämäärä: {new Date(ajo.ajankohta).toLocaleDateString()}</p>
          <p>Asiakas: {ajo.asiakas}</p>
          <p>Yhteystiedot: {ajo.yhteystiedot}</p>
          <p>Lisätiedot: {ajo.lisatietoja}</p>
        </div>
      ))}
    </div>
    <div style={{ marginTop: '20px' }}>
      <h2>Poistettavat ajotiedot:</h2>
      <ul>
        {ajot.map((ajo) => (
          <li key={ajo.id}>
            {ajo.osoite} - <button onClick={() => handleDelete(ajo.id)}>Poista</button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

};

export default Kartta;
