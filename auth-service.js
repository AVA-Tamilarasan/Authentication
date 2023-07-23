const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 5001;
const app = express();

const secretKey = 'my-private-key'; // Replace this with your actual secret key

app.use(cors({ origin: process.env.REACT_APP_BACKEND_URL }));
app.use(bodyParser.json());

// Endpoint for generating a token
app.post('/generate-token', (req, res) => {
  const { publicKey } = req.body;
  console.log('Received publicKey:', publicKey); // Add this log to see the incoming data

  if (!publicKey) {
    return res.status(400).json({ error: 'Public key not provided' });
  }

  const token = jwt.sign({}, secretKey, { subject: publicKey, algorithm: 'HS256' });
  console.log('Generated token:', token); // Add this log to see the generated token
  res.json({ token });
});

// Middleware to verify the token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  console.log('Received token:', token);

  jwt.verify(token, secretKey, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.sendStatus(403);
    }

    req.user = decoded.sub;
    console.log('User authorized:', req.user);
    next();
  });
}

app.get('/backend', authenticateToken, (req, res) => {
  res.json({ message: 'Authorized access to the backend!', user: req.user });
});

app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
