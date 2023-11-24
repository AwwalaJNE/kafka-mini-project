const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log('Received POST request with payload:', req.body);
  res.status(200).send('OK');
});

app.post('/webhook', async (req, res) => {
  console.log('Webhook body:', req.body);
  res.status(200).send(req.headers);
});

app.listen(port, () => {
  console.log(`Webhook server is running at http://localhost:${port}`);
});