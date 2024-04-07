const express = require('express');
const router = express.Router();
const mysql2 = require('mysql2');

// Luo tietokantayhteys
const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ubhx72ge',
  database: 'ajojarjestelma',
});

// DELETE-reitti poistolle
router.delete('/:id', (req, res) => {
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

module.exports = router;