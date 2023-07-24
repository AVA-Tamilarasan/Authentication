const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const port = 5001;
const app = express();
const axios = require('axios'); 

const privateKey = fs.readFileSync('private_key.pem'); // Load the private key from file

app.use(cors());
app.use(bodyParser.json());

// Endpoint for generating a token and sending it to the backend
app.post('/generate-and-send-token', (req, res) => {
  const { sub } = req.body;

  if (!sub) {
    return res.status(400).json({ error: 'Subject (sub) not provided' });
  }

  const payload = {
    sub: sub,
  };

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  // Send the generated token to the backend
  axios
    .post('http://127.0.0.1:4000/api/receive-token', { token })
    .then(() => {
      console.log('Token sent to the backend successfully');
      res.json({ message: 'Token sent to the backend successfully' });
    })
    .catch((error) => {
      console.error('Failed to send token to the backend:', error.message);
      res.status(500).json({ error: 'Failed to send token to the backend' });
    });
});

app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
