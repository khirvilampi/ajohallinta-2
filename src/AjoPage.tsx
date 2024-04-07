import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Ajo {
  id: number;
  asiakas: string;
  ajankohta: string;
  osoite: string;
  paikkakunta: string;
  yhteystiedot: string;
  lisatietoja: string;
  lat: string;
  lng: string;
}

const AjoPage: React.FC = () => {
  const [ajot, setAjot] = useState<Ajo[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAjot = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/ajot');
        setAjot(response.data);
      } catch (error) {
        setError('Virhe haettaessa ajoja tietokannasta.');
      }
    };

    fetchAjot();
  }, []);

  async function handleDelete(id: number) {
    try {
      const endpoint = `http://localhost:8080/api/ajot/${id}`;
      const result = await fetch(endpoint, { method: 'DELETE' });
      if (result.ok) {
        console.log('Poisto onnistui');
        // Tee tarvittavat toimenpiteet, esimerkiksi tilan päivitys
      } else {
        console.error('Poisto epäonnistui');
      }
    } catch (error) {
      console.error('Virhe poistettaessa ajoa:', error);
    }
  }


  return (
    <div>
      <h1>Ajojen tarkastelu</h1>
      {error && <p>{error}</p>}
      <ul>
        {ajot.map((ajo) => (
          <li key={ajo.id}>
            <h2>Asiakas: {ajo.asiakas}</h2>
            <p>Ajankohta: {ajo.ajankohta}</p>
            <p>Osoite: {ajo.osoite}</p>
            <p>Paikkakunta: {ajo.paikkakunta}</p>
            <p>Yhteystiedot: {ajo.yhteystiedot}</p>
            <p>Lisätietoja: {ajo.lisatietoja}</p>
            <p>Latitudi: {ajo.lat}</p>
            <p>Longitudi: {ajo.lng}</p>
            <button onClick={() => handleDelete(ajo.id)}>Poista</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AjoPage;
