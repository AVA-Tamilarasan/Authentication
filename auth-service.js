const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 5001;
const app = express();

const secretKey = 'my-private-key'; // Replace this with your actual secret key


const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk5MeaO3BAWMknpxivKfC
5ti+oamwNiwplkKdR8FXJv+McxSLqL0ZjZlVgVIXNgSbwFx1WhGY1idnoQMLpsST
qMjrzZlYu6uCHc2NDNVp27hrwTLaAnQ50SShCjOjmn7kdKfZ6fEC9IAHt8h7BMbc
5LY8ACPRkp1gn/iBy9BYtxlxMVRaQ0g+xkSY9zYlHJ/PAzm60sADlGi3BBpuiPVp
0tKcqyzxM4pJxCVsON5kjDwH+H4QXvNKEVwsK2Ad9Mo9iYRDZobSxqVzVqhdNlRX
7es0e1L5ciGsMXCToa+VTSf1dLXRhNxgfmUiInktjeLY3IBWuPz7U370bs8q+SOw
nwIDAQAB
-----END PUBLIC KEY-----`;


app.use(cors());
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
