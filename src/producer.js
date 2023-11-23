const { Kafka } = require('kafkajs');

const clientId = 'my-app2';
const brokers = ['kafka.jne.co.id:8080'];
const topic = 'test-trigger';

const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer();

const produce = async (data) => {
  await producer.connect();

  try {
    await producer.send({
      topic,
      messages: [
        { 
          key: data.connote_number,
          value: JSON.stringify({
            payload: data
          }) 
        }
      ],
    });
  } catch (err) {
    console.error("Could not write message:", err);
  } finally {
    await producer.disconnect();
  }
};

module.exports = produce;