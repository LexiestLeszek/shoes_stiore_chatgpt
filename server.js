const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());

const conn = mysql.createPool({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'shoes',
});

// route for saving shoe listings to the database
app.post('/add-shoes', async (req, res) => {
  const { price, description, pictures, phone } = req.body;

  try {
    const [result] = await conn.query('INSERT INTO shoes (price, description, pictures, phone) VALUES (?, ?, ?, ?)', [price, description, pictures, phone]);
    res.send({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while saving the shoe listing.' });
  }
});

// route for searching for shoes in the database
app.post('/search', async (req, res) => {
  const { price, size, color } = req.body;
  let query = 'SELECT * FROM shoes';
  let params = [];

  // build WHERE clause for search criteria
  if (price || size || color) {
    query += ' WHERE';
    if (price) {
      query += ' price = ?';
      params.push(price);
    }
    if (size) {
      if (params.length > 0) query += ' AND';
      query += ' size = ?';
      params.push(size);
    }
    if (color) {
      if (params.length > 0) query += ' AND';
      query += ' color = ?';
      params.push(color);
    }
  }

  try {
    const [results] = await conn.query(query, params);
    res.send(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while searching for shoes.' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
