import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LuoAjoPage: React.FC = () => {
  const [asiakas, setAsiakas] = useState('');
  const [ajankohta, setAjankohta] = useState('');
  const [osoite, setOsoite] = useState('');
  const [paikkakunta, setPaikkakunta] = useState('');
  const [yhteystiedot, setYhteystiedot] = useState('');
  const [lisatietoja, setLisatietoja] = useState('');
  const [ajaja, setAjaja] = useState('');
  const [ajajat, setAjajat] = useState([]);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    
    async function fetchAjajat() {
      try {
        const response = await axios.get('http://localhost:8080/api/ajajat');
        setAjajat(response.data);
      } catch (error) {
        console.error('Virhe haettaessa ajajia:', error);
        setError('Virhe haettaessa ajajia');
      }
    }

    fetchAjajat();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const paikkatiedot = await haeSijainti();
      setLat(paikkatiedot.lat);
      setLng(paikkatiedot.lon);

      const response = await fetch('http://localhost:8080/api/luoajo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asiakas,
          ajankohta,
          osoite,
          paikkakunta,
          yhteystiedot,
          lisatietoja,
          lat: paikkatiedot.lat,
          lng: paikkatiedot.lon,
          ajaja,
        }),
      });

      if (!response.ok) {
        throw new Error('Virhe lisätessä ajoa.');
      }

      console.log('Ajo lisätty onnistuneesti.');
      alert(`Olet Lisännyt Ajon kuskille ${ajaja}.`);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const haeSijainti = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${osoite}, ${paikkakunta}`);
      if (response.data.length > 0) {
        return {
          lat: response.data[0].lat,
          lon: response.data[0].lon,
        };
      } else {
        throw new Error('Sijaintia ei löytynyt');
      }
    } catch (error) {
      console.error('Virhe haettaessa sijaintia:', error);
      throw error;
    }
  };

  return (
    <div>
      <h1>Luo uusi ajo</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Asiakas:
          <input type="text" value={asiakas} onChange={(e) => setAsiakas(e.target.value)} />
        </label>
        <br />

        <label>
          Ajankohta:
          <input type="date" value={ajankohta} onChange={(e) => setAjankohta(e.target.value)} />
        </label>
        <br />

        <label>
          Osoite:
          <input type="text" value={osoite} onChange={(e) => setOsoite(e.target.value)} />
        </label>
        <br />

        <label>
          Paikkakunta:
          <input type="text" value={paikkakunta} onChange={(e) => setPaikkakunta(e.target.value)} />
        </label>
        <br />

        <label>
          Yhteystiedot:
          <input type="text" value={yhteystiedot} onChange={(e) => setYhteystiedot(e.target.value)} />
        </label>
        <br />

        <label>
          Lisätietoja:
          <textarea value={lisatietoja} onChange={(e) => setLisatietoja(e.target.value)} />
        </label>
        <br />

    
        <label>
          Valitse ajaja:
          <select value={ajaja} onChange={(e) => setAjaja(e.target.value)}>
  <option value="">Valitse...</option>
  {ajajat.map((ajaja: any) => (
    <option key={ajaja.id} value={ajaja.id}>
      {ajaja.firstname} {ajaja.lastname}
    </option>
  ))}
</select>

        </label>
        <br />

        <button type="submit">Luo ajo</button>
      </form>
    </div>
  );
};

export default LuoAjoPage;