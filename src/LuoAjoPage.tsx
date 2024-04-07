// LuoAjoPage.tsx

import React, { useState } from 'react';

const LuoAjoPage: React.FC = () => {
  const [asiakas, setAsiakas] = useState('');
  const [ajankohta, setAjankohta] = useState('');
  const [osoite, setOsoite] = useState('');
  const [paikkakunta, setPaikkakunta] = useState('');
  const [yhteystiedot, setYhteystiedot] = useState('');
  const [lisatietoja, setLisatietoja] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/lisaaAjo', {
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
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result); 
        
      } else {
        console.error('Virhe tallennuksessa:', result.error);
      }
    } catch (error) {
      console.error('Virhe tallennuksessa:', (error as Error).message);

    }
  };

  return (
    <div>
      <h1>Luo uusi ajo</h1>
      <form onSubmit={handleSubmit}>
        {/* Lomakekentät tässä */}

        <label>
          Asiakas:
          <input type="text" value={asiakas} onChange={(e) => setAsiakas(e.target.value)} />
        </label>
        <br />

        {/* Muut lomakekentät samalla tavalla */}

        <label>
          Lisätietoja:
          <textarea value={lisatietoja} onChange={(e) => setLisatietoja(e.target.value)} />
        </label>
        <br />

        <button type="submit">Luo ajo</button>
      </form>
    </div>
  );
};

export default LuoAjoPage;
