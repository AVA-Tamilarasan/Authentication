// authentication-service/index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();

const privateKey = fs.readFileSync('private_key.pem');
const publicKey = fs.readFileSync('public_key.pem');

app.use(cors());
app.use(bodyParser.json());

function generateToken(payload) {
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

app.post('/generate-token', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'User ID not provided' });
  }

  const payload = {
    sub: userId,
  };

  const token = generateToken(payload);
  res.json({ token });
});

app.post('/verify-token', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  verifyToken(token)
    .then((decoded) => {
      res.json({ valid: true, decoded });
    })
    .catch((err) => {
      console.error('Token verification failed:', err);
      res.json({ valid: false, error: err.message });
    });
});

const port = 5001;
app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
