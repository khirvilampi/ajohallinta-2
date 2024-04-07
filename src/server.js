const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: '1234',
  password: '1234',
  database: '1234',
});

connection.connect();

app.post('/api/lisaaAjo', (req, res) => {
  const {
    asiakas,
    ajankohta,
    osoite,
    paikkakunta,
    yhteystiedot,
    lisatietoja,
  } = req.body;

  const sql = `INSERT INTO ajo (asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [asiakas, ajankohta, osoite, paikkakunta, yhteystiedot, lisatietoja], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Virhe tallennettaessa tietoja.');
    } else {
      res.status(200).send('Tiedot tallennettu onnistuneesti.');
    }
  });
});

const port = 3000;

app.listen(port, () => {
  console.log(`Palvelin kuuntelee porttia ${port}`);
});
