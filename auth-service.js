const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const port = 5001;
const app = express();

const privateKey = fs.readFileSync('private_key.pem'); // Load the private key from file

app.use(cors());
app.use(bodyParser.json());

// Endpoint for generating a token
app.post('/generate-token', (req, res) => {
  const { sub } = req.body;
  console.log('Received sub:', sub); // Add this log to see the incoming data

  if (!sub) {
    return res.status(400).json({ error: 'Subject (sub) not provided' });
  }

  const payload = {
    sub: sub,
  };

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  console.log('Generated token:', token); // Add this log to see the generated token
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Token not provided.' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, privateKey, { algorithms: ['RS256'] }, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });

    // Store the user information in the request object for later use
    req.user = user;
    next(); // Call the next middleware or route handler
  });
}



app.get('/backend', authenticateToken, (req, res) => {
  res.json({ message: 'Authorized access to the backend!', user: req.user });
});

app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
