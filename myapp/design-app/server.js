const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Save project (STL, PCB JSON)
app.post('/save', (req, res) => {
  const { name, data, type } = req.body;
  if (!name || !data || !type) return res.status(400).send("Invalid data");

  const ext = type === 'cad' ? '.stl' : '.json';
  fs.writeFileSync(path.join(__dirname, 'projects', name + ext), data);
  res.send("Saved!");
});

// List saved projects
app.get('/projects', (req, res) => {
  const files = fs.readdirSync(path.join(__dirname, 'projects'));
  res.json(files);
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
