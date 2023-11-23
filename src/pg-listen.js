const { Client } = require("pg");
const PgListen = require("pg-listen");
const consume = require("./consumer");
const produce = require("./producer");
const dbConfig = require('./dbconfig')

const connectionString = `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`;

const pgClient = new Client({ connectionString });
const pgListen = new PgListen({ connectionString });

const listener = async () => {
  await pgClient.connect();
  await pgListen.connect();
  await pgListen.listenTo("kafka_channel");

  pgListen.notifications.on("kafka_channel", async (payload) => {
    try {
      await produce(payload);
    } catch (error) {
      console.error("Error sending message to Kafka:", error);
    }
  });

  consume();

  console.log("Listening for PostgreSQL notifications...");
};

listener().catch((error) => console.error("Error starting application:", error));
