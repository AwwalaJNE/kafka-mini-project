const { Kafka } = require("kafkajs")

const clientId = "my-app"
const brokers = ["kafka.jne.co.id:8080"]
const topic = "test-consumer"

const kafka = new Kafka({ clientId, brokers })
const consumer = kafka.consumer({ groupId: clientId })

const consume = async () => {
	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: ({ message }) => {
			console.log(`received message: ${message.value}`)
		},
	})
}

module.exports = consume
