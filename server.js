const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const SECRET = "super_secret_key";

// Helpers
function readUsers() {
  return JSON.parse(fs.readFileSync('users.json'));
}

function writeUsers(data) {
  fs.writeFileSync('users.json', JSON.stringify(data, null, 2));
}

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send("No token");

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// AUTH ROUTES
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing fields");

  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return res.status(400).send("User exists");
  }

  users.push({
    username,
    password: bcrypt.hashSync(password, 8)
  });

  writeUsers(users);
  res.send("Registered");
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ username }, SECRET);
  res.json({ token });
});

// PROJECT SAVE (AUTH REQUIRED)
app.post('/save', auth, (req, res) => {
  const { name, type, data } = req.body;
  const dir = `projects/${req.user.username}`;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const ext = type === 'cad' ? '.stl' : '.json';
  fs.writeFileSync(`${dir}/${name}${ext}`, data);

  res.send("Project saved");
});

// LIST PROJECTS
app.get('/projects', auth, (req, res) => {
  const dir = `projects/${req.user.username}`;
  if (!fs.existsSync(dir)) return res.json([]);
  res.json(fs.readdirSync(dir));
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
