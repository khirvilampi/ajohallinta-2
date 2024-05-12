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
}

const AjoPage: React.FC = () => {
  const [ajot, setAjot] = useState<Ajo[]>([]);
  const [error, setError] = useState<string>('');
  const [editingAjo, setEditingAjo] = useState<Ajo | null>(null);
  const [editedAjoData, setEditedAjoData] = useState<Ajo>({
    id: 0,
    asiakas: '',
    ajankohta: '',
    osoite: '',
    paikkakunta: '',
    yhteystiedot: '',
    lisatietoja: '',

  });
  
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

  /*async function handleDelete(id: number) {
    try {
      const endpoint = `http://localhost:8080/api/ajot/${id}`;
      const result = await fetch(endpoint, { method: 'DELETE' });
      if (result.ok) {
        console.log('Poisto onnistui');
        // Poista poistettu ajo tilasta
        setAjot((prevAjot) => prevAjot.filter((ajo) => ajo.id !== id));
      } else {
        console.error('Poisto epäonnistui');
      }
    } catch (error) {
      console.error('Virhe poistettaessa ajoa:', error);
    }
  } */ // poistettu käytöstä toistaiseksi , toiminnassa , kun lisää <button onClick={() => handleDelete(ajo.id)}>Poista</button>  

  async function handleEdit(id: number) {
    try {
      const ajoToEdit = ajot.find((ajo) => ajo.id === id);
      if (ajoToEdit) {
        setEditingAjo(ajoToEdit);
        setEditedAjoData({
          id: ajoToEdit.id,
          asiakas: ajoToEdit.asiakas,
          ajankohta: ajoToEdit.ajankohta,
          osoite: ajoToEdit.osoite,
          paikkakunta: ajoToEdit.paikkakunta,
          yhteystiedot: ajoToEdit.yhteystiedot,
          lisatietoja: ajoToEdit.lisatietoja,

        });
      }
    } catch (error) {
      console.error('Virhe muokattaessa ajoa:', error);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedAjoData({ ...editedAjoData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/api/ajot/${editedAjoData.id}`, editedAjoData);
      console.log('Muokkaus onnistui', response.data);
      const updatedAjot = ajot.map((ajo) => (ajo.id === editedAjoData.id ? editedAjoData : ajo));
      setAjot(updatedAjot);
      setEditingAjo(null);
    } catch (error) {
      console.error('Virhe muokattaessa ajoa:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  
  return (
    <div>
      <h1>Ajojen tarkastelu</h1>
      {error && <p>{error}</p>}
      <ul>
        {ajot.map((ajo) => (
          <li key={ajo.id}>
            <h2>Asiakas: {ajo.asiakas}</h2>
            <p>Ajankohta: {formatDate(ajo.ajankohta)}</p>
            <p>Osoite: {ajo.osoite}</p>
            <p>Paikkakunta: {ajo.paikkakunta}</p>
            <p>Yhteystiedot: {ajo.yhteystiedot}</p>
            <p>Lisätietoja: {ajo.lisatietoja}</p>
            <button onClick={() => handleEdit(ajo.id)}>Muokkaa</button>
            {editingAjo && editingAjo.id === ajo.id && (
              <form onSubmit={handleSubmit}>
                <input type="text" name="asiakas" value={editedAjoData.asiakas} onChange={handleInputChange} />
                <input type="text" name="ajankohta" value={formatDate(editedAjoData.ajankohta)} onChange={handleInputChange} />
                <input type="text" name="osoite" value={editedAjoData.osoite} onChange={handleInputChange} />
                <input type="text" name="paikkakunta" value={editedAjoData.paikkakunta} onChange={handleInputChange} />
                <input type="text" name="yhteystiedot" value={editedAjoData.yhteystiedot} onChange={handleInputChange} />
                <input type="text" name="lisatietoja" value={editedAjoData.lisatietoja} onChange={handleInputChange} />
                <button type="submit">Tallenna muutokset</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AjoPage;
