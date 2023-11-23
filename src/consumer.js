const { Kafka } = require('kafkajs');

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
    },
  });
};

module.exports = consume;