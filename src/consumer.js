const { Kafka } = require('kafkajs');
const axios = require('axios');
const getWebhookUrlsFromDatabase = require('./databaseUtils');

const clientId = 'my-app2';
const brokers = ['kafka.jne.co.id:8080'];
const topic = 'test-trigger';

const kafka = new Kafka({ clientId, brokers });
const consumer = kafka.consumer({ groupId: clientId });

const consume = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log('Received message', {
        value: message.value.toString()
      })

      const payload = JSON.parse(message.value.toString());
      const webhookUrls = await getWebhookUrlsFromDatabase();

      await Promise.all(webhookUrls.map(async (webhookUrl) => {
        try {
          const headers = {
            'Content-Type': 'application/json',
            ...webhookUrl.header,
          };

          await axios.post(webhookUrl.url, payload, { headers });

          console.log(`Notification sent to ${webhookUrl.url}`);
        } catch (error) {
          console.error(`Failed to send notification to ${webhookUrl.url}.`, error.message);
        }
      }));
    },
  });
};

module.exports = consume;
