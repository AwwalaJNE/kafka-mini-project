const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log('Received POST request with payload:', req.body);
  res.status(200).send('OK');
});

app.post('/webhook', async (req, res) => {
  console.log('Webhook body:', req.body);
  // console.log('Webhook headers:', req.headers);
  // console.log('Webhook url:', req.headers.host);

  res.status(200).send(req.headers);
});

app.listen(port, () => {
  console.log(`Webhook server is running at http://localhost:${port}`);
});