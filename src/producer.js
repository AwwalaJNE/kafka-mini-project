const { Kafka } = require("kafkajs")

const clientId = "my-app"
const brokers = ["kafka.jne.co.id:8080"]
const topic = "test-consumer"

const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer()

const produce = async () => {
	await producer.connect()
	let i = 0

	setInterval(async () => {
		try {
			await producer.send({
				topic,
				messages: [
					{
						key: String(i),
						value: "this is message " + i,
					},
				],
			})

			console.log("writes: ", i)
			i++
		} catch (err) {
			console.error("could not write message " + err)
		}
	}, 1000)
}

module.exports = produce
