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
interface KarttaProps {
  loggedInUser: any;
}



const Kartta: React.FC<{loggedInUser: any}> = ({ loggedInUser }) => {
  const [ajot, setAjot] = useState<any[]>([]);
  const [ajaja, setAjaja] = useState<string>('');
  const [ajajat, setAjajat] = useState<[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([60.1695, 24.9354]);

  useEffect(() => {
    console.log(loggedInUser); 
  }, [loggedInUser]);
  

  useEffect(() => {
    const haeAjot = async () => {
      try {
        if (!loggedInUser) {

          setAjot([]);
          return;
        }
  
        if (loggedInUser.role === 'dispatcher') {
          // Haetaan kaikki ajot
          const response = await axios.get(`http://localhost:8080/api/ajot`);
          setAjot(response.data);
        } else if (loggedInUser.role === 'driver') {
          // Haetaan käyttäjän omat ajot
          const response = await axios.get(`http://localhost:8080/api/ajot?ajaja=${loggedInUser.id}`);
          setAjot(response.data);
        }
        
      } catch (error) {
        console.error('Virhe haettaessa ajotietoja:', error);
      }
    };
  
    haeAjot();
  }, [loggedInUser, ajaja]); 
  
  


  

  useEffect(() => {
    async function fetchAjajat() {
      try {
        const response = await axios.get('http://localhost:8080/api/ajajat');
        setAjajat(response.data);
    
        if (loggedInUser && loggedInUser.role === 'dispatcher' && response.data.length > 0) {
          setAjaja(response.data);
        }
      } catch (error) {
        console.error('Virhe haettaessa ajajia:', error);
      }
    }
  
    if(loggedInUser && loggedInUser.role === 'dispatcher') {
      fetchAjajat();
    }
  }, [loggedInUser]);
  


  


  const handleAddressClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
  };

const handleDelete = async (id: number) => {
  console.log('Poistettavan tiedon ID:', id); 

  try {
    await axios.delete(`http://localhost:8080/api/ajot/${id}`);
    setAjot(prevAjot => prevAjot.filter(ajo => ajo.id !== id)); 
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
          <p>Kuski: {ajo.firstname} {ajo.lastname}</p> 
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
          <p>Kuski: {ajo.firstname} {ajo.lastname}</p> 
        </div>
      ))}
    </div>
    
    {loggedInUser.role === 'dispatcher' && (
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
)}
  </div>

  
  
);

};

export default Kartta;