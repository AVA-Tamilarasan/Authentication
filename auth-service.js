const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const port = 5001;
const app = express();

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCTkx5o7cEBYySe
nGK8p8Lm2L6hqbA2LCmWQp1HwVcm/4xzFIuovRmNmVWBUhc2BJvAXHVaEZjWJ2eh
AwumxJOoyOvNmVi7q4IdzY0M1WnbuGvBMtoCdDnRJKEKM6OafuR0p9np8QL0gAe3
yHsExtzktjwAI9GSnWCf+IHL0Fi3GXExVFpDSD7GRJj3NiUcn88DObrSwAOUaLcE
Gm6I9WnS0pyrLPEziknEJWw43mSMPAf4fhBe80oRXCwrYB30yj2JhENmhtLGpXNW
qF02VFft6zR7UvlyIawxcJOhr5VNJ/V0tdGE3GB+ZSIieS2N4tjcgFa4/PtTfvRu
zyr5I7CfAgMBAAECggEACUtpzegI5kJ39aQZ3+dHskG9IpzNDrcSA3cR8DQFfjJN
hpipAdQEflOa/A3PN8VrMzQKPBsBn53/ETgKOChcuHO3I6Lgi3642jxZAZGWHOhC
TnpvxVnL+RfagLRR6JLMvBWE9w6z8JxOYCKOBPYAHEjnVzGVAIFNqvr8NHmx12Oi
qOM1vECF1OQ96dzwG+IVMGnlFt0wkst3XUjN92DX0N3Dx09NnLqQ0Tp8XsXJMOL4
cLqwJmCnMGLhvDDcuTbRotuoBwjouAx8pJtPu7F25ydewwkfhr2avcgMNISyUHhd
SQ4zcpI/TbQZGnEcDWfA4ux9RkqxImbcue1RSKpCKQKBgQC6Q/2x8xle0C+APZJx
7Bf6K29zwGSfcv75yNVYclGpPdbQtb9qcZY1VPsSnmAtwzWUczc8UKqzdiY7yC80
Dq6O9yzg/M1gSX5AlgB5pPSkJTScSJ0IHsrgkLLnKLJemWHxcMeUb9/fiaSEI11u
qJyHBf0BGd7q88RhoUsL65Wm5QKBgQDK0u0EwdR8L5dvN3Jqgzu/meNyith1mcBE
wwW02X/PRzcW9SIijRnWTW2a6m2DFz5k5wNWO5dm47AHearfOgJIkWSUyvSxLG5V
j5m03brAtT4YCd3z0Jd5PZ/iUAp/FyvD4Xqke/rg18OQllewWdLB4z7KHBH21hsB
5QTndoWdMwKBgFnR/Z15H+vTsoRBrMPY2LsfhPApf5xQRNpI2XB8OBrHojYk3nhC
6+8t2qDg1Hpc3xKF+MXSFG7T853ya6jLx6tTUEXyQktDRWl5rCL8w6f/9P3EGk1X
I/fkbxD/U/xANLXL78IJrMhLxJSfxSdekZSe86E7S367LCD0OY82/IRtAoGAM2B0
q6TRx1di28hG0lZF10YLCGPFaxy0SHbCRkpmBsJ6YPVdXTUy20cnwXsqnG9R3ctq
2/giZOy+FVargvo1w94YhVxX2V1w4XmLrPYRrWj7vqkZMP6gsBR9IJ232vOqoWbH
Y00IgtYE8uYydjh6m6SNrjKoFker9bHmqR8rv2MCgYBIJVnQ7pc0nJ73DN5gapbQ
XGk6mS4u3Iq62xO+zNtxUIe9jYi9jkqTRBDG3nyrquzeAcQvWhHN1iwecnYJShtF
aAbeH8QhJnI3fJfA/fjf/1rqv669QtOcr55F5fhZIS1tMihOHTCC9La5C2ZpRyaD
zFzcjVYpRHmb7RuDKcU/Vg==
-----END PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk5MeaO3BAWMknpxivKfC
5ti+oamwNiwplkKdR8FXJv+McxSLqL0ZjZlVgVIXNgSbwFx1WhGY1idnoQMLpsST
qMjrzZlYu6uCHc2NDNVp27hrwTLaAnQ50SShCjOjmn7kdKfZ6fEC9IAHt8h7BMbc
5LY8ACPRkp1gn/iBy9BYtxlxMVRaQ0g+xkSY9zYlHJ/PAzm60sADlGi3BBpuiPVp
0tKcqyzxM4pJxCVsON5kjDwH+H4QXvNKEVwsK2Ad9Mo9iYRDZobSxqVzVqhdNlRX
7es0e1L5ciGsMXCToa+VTSf1dLXRhNxgfmUiInktjeLY3IBWuPz7U370bs8q+SOw
nwIDAQAB
-----END PUBLIC KEY-----`;

app.use(cors({ origin: process.env.REACT_APP_BACKEND_URL }));
app.use(bodyParser.json());

// Endpoint for generating a token
app.post('/generate-token', (req, res) => {
  const { publicKey } = req.body;
  console.log('Received publicKey:', publicKey);

  if (!publicKey) {
    return res.status(400).json({ error: 'Public key not provided' });
  }

  try {
    // Sign the token using the private key and subject (sub) as the public key
    const token = jwt.sign({}, privateKey, { algorithm: 'RS256', subject: publicKey });
    console.log('Generated token:', token);
    res.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Middleware to verify the token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  console.log('Received token:', token);

  try {
    // Verify the token using the public key
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    req.user = decoded.sub;
    console.log('User authorized:', req.user);
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.sendStatus(403);
  }
}

app.get('/backend', authenticateToken, (req, res) => {
  res.json({ message: 'Authorized access to the backend!', user: req.user });
});

app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
