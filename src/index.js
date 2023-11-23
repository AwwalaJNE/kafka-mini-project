const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const PgListen = require("pg-listen");

const consume = require("./consumer");
const produce = require("./producer");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbConfig = {
  user: 'jnecoreapp',
  password: 'JNE$@coRe^23+!',
  host: 'pgm-d9jwj70z9wf50d982o.pgsql.ap-southeast-5.rds.aliyuncs.com',
  database: 'corev2',
};

const connectionString = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`;

const pgClient = new Client({ connectionString });
const pgListen = new PgListen({ connectionString });

app.post('/webhook', async (req, res) => {
  console.log('Webhook body:', req.body);
  // console.log('Webhook headers:', req.headers);
  // console.log('Webhook url:', req.headers.host);

  res.status(200).send(req.headers);
});

const run = async () => {
  await pgClient.connect();
  await pgListen.connect();
  await pgListen.listenTo("kafka_channel");

  pgListen.notifications.on("kafka_channel", async (payload) => {
    try {
      await produce(payload);
      await consume();
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
    }
  });  
};

app.listen(port, () => {
  console.log('port', port);
  run().catch((error) => console.error("Error starting application:", error));
});
