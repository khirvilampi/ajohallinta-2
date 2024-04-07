const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ubhx72ge',
  database: 'ajojarjestelma',
});

connection.connect((err) => {
  if (err) {
    console.error('Virhe tietokantayhteyden muodostamisessa:', err);
    return;
  }
  console.log('Yhdistetty MySQL-tietokantaan.');
});

app.post('/api/luoajo', (req, res) => {
  const { asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng } = req.body;

  const sql = `INSERT INTO ajo (asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng], (err, results) => {
    if (err) {
      console.error('Virhe tallennettaessa tietoja:', err);
      res.status(500).json({ error: 'Virhe tallennettaessa tietoja' });
      return;
    }
    console.log('Tiedot tallennettu onnistuneesti.');
    res.json({ success: true });
  });
});

app.get('/api/ajot', (req, res) => {
  connection.query('SELECT * FROM ajojarjestelma.ajo', (error, results, fields) => {
    if (error) {
      console.error('Virhe haettaessa ajotietoja:', error);
      res.status(500).json({ error: 'Virhe haettaessa ajotietoja' });
      return;
    }
    console.log('Ajotiedot haettu onnistuneesti.');
    res.json(results);
  });
});

app.delete('/api/ajot/:id', (req, res) => {
  const id = req.params.id;

  const sql = 'DELETE FROM ajojarjestelma.ajo WHERE id = ?';
  connection.query(sql, [id], (error, results) => {
    if (error) {
      console.error('Virhe poistettaessa tietoja:', error);
      res.status(500).json({ error: 'Virhe poistettaessa tietoja' });
      return;
    }
    console.log('Tiedot poistettu onnistuneesti.');
    res.json({ success: true });
  });
});

app.post('/rekisterointi', (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  
  const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  connection.query(sql, [firstname, lastname, email, password], (error, results) => {
    if (error) {
      console.error('Virhe tallennettaessa tietoja:', error);
      res.status(500).json({ error: 'Virhe tallennettaessa tietoja' });
      return;
    }
    console.log('Tiedot tallennettu onnistuneesti.');
    res.status(201).json({ message: 'Rekisteröinti onnistui' });
  });
});



const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
