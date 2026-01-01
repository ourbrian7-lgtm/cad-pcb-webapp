const express = require('express');
const initSqlJs = require('sql.js');

const app = express();

initSqlJs().then(SQL => {
  const db = new SQL.Database();
  console.log("In-memory SQL.js Database Ready");

  app.get('/', (req, res) => {
    res.send('Running with Pure JavaScript SQLite (sql.js)!');
  });

  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
});
