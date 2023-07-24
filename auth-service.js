const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 5001;
const app = express();

const secretKey = Buffer.from(process.env.SECRET_KEY, 'base64'); // Use your environment variable here

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

app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
