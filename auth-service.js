const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 5001;
const app = express();

const secretKey = process.env.SECRET_KEY; // Replace this with your actual secret key

app.use(cors());
app.use(bodyParser.json());

// Endpoint for generating a token
app.post('/generate-token', (req, res) => {
  const { publicKey } = req.body;
  console.log('Received publicKey:', publicKey); // Add this log to see the incoming data

  if (!publicKey) {
    return res.status(400).json({ error: 'Public key not provided' });
  }

  const payload = {
    sub: publicKey,
  };

  const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });
  console.log('Generated token:', token); // Add this log to see the generated token
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
