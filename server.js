const express = require('express');
const mysql2 = require('mysql2');
const cors = require('cors');
const axios = require('axios');
const app = express();
const Pool = require('pg').Pool
app.use(express.json());
app.use(cors()); 
const connection = new Pool({
  user: "root",
  host: "localhost",
  database: "konstankanta",
  password: "HAGt949osBTDK1MVSt9lqBMaUhZJjTV3",
  port: 5432,
});
connection.connect((err) => {
  if (err) {
    console.error('Virhe tietokantayhteyden muodostamisessa:', err);
    return;
  }
  console.log('Yhdistetty MySQL-tietokantaan.');
});

app.post('/api/luoajo', (req, res) => {
  const { asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, ajaja } = req.body;

  const sql = `INSERT INTO ajo (asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, ajaja) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, ajaja], (err, results) => {
    if (err) {
      console.error('Virhe tallennettaessa tietoja:', err);
      res.status(500).json({ error: 'Virhe tallennettaessa tietoja' });
      return;
    }
    console.log('Tiedot tallennettu onnistuneesti.');
    res.json({ success: true });
  });
});

app.get('/api/ajajat', (req,res) => {
  connection.query('SELECT id, firstname, lastname FROM ajojarjestelma.users WHERE rooli = "driver"', (err, results) => {
    if (err) {
      console.error('virhe haettaessa ajajia:', err);
      res.status(500).json({ error: 'virhe haettaessa ajajia'});
      return; 
    }
    console.log('Ajotiedot haettu onnistuneesti.');
    res.json(results);
  });
  
});

app.get('/api/ajot', (req, res) => {
  let query = `
    SELECT ajo.*, users.firstname, users.lastname 
    FROM ajojarjestelma.ajo AS ajo
    JOIN users ON ajo.ajaja = users.id
  `;
  if (req.query.ajaja) {
    // Jos pyyntössä on määritelty ajaja, haetaan vain kyseisen ajajan ajot
    query += `WHERE ajo.ajaja = ?`;
  }
  connection.query(query, [req.query.ajaja], (error, results, fields) => {
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

app.put('/api/ajot/:id', (req, res) => {
  const id = req.params.id;
  const { asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng } = req.body;

  const sql = 'UPDATE ajojarjestelma.ajo SET asiakas = ?, ajankohta = ?, osoite = ?, paikkakunta = ?, yhteystiedot = ?, lisatietoja = ?, lat = ?, lng = ? WHERE id = ?';
  connection.query(sql, [asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja, lat, lng, id], (err, result) => {
    if (err) {
      console.error('Virhe tietokannassa:', err);
      res.status(500).json({ success: false, message: 'Tietojen päivitys epäonnistui' });
      return;
    }
    res.status(200).json({ success: true, message: 'Tietojen päivitys onnistui' });
  });
});




app.post('/rekisterointi', (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  connection.query(sql, [firstname, lastname, email, password], (error, results) => {
    if (error) {
      console.error('Virhe tallennettaessa tietoja:', error);
      res.status(500).json({ error: 'Virhe tallennettaessa tietoja' });
    } else {
      // Tietojen tallennus onnistui
      res.status(200).json({ success: true, message: 'Tiedot tallennettu onnistuneesti' });
    }
  });
});

app.post('/login', (req, res) => {
  const { firstname, lastname, password, } = req.body;

  const sql = 'SELECT * FROM users WHERE firstname = ? AND lastname = ? AND BINARY password = ?';
  connection.query(sql, [firstname, lastname, password], (err, result) => {
    if (err) {
      console.error('Virhe tietokannasta:', err);
      res.status(500).json({ success: false, message: 'Virhe tietokannasta' });
      return;
    }
    if (result.length > 0) {
      console.log('tulos',result);
      if (result[0].password === password) {
        // Hae käyttäjän rooli
        const user = result[0];
        console.log("Käyttäjä",user);
        const role = user.rooli;
        const userId = user.id;

        // Lisää rooli vastaukseen
        const response = {
          success: true,
          message: 'Tervetuloa!',
          user: {
            id: userId, 
            firstname: user.firstname,
            lastname: user.lastname,
            role: role
          }
        };
        res.status(200).json(response);
      } else {
        res.status(401).json({ success: false, message: 'Väärä salasana' });
      }
    } else {
      // Käyttäjää ei löytynyt
      res.status(401).json({ success: false, message: 'Väärä etunimi, sukunimi tai salasana' });
    }
  });
});




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Palvelin käynnissä portissa ${PORT}`);
});
