const amqplib = require("amqplib");

async function runProducer() {
  try {
    const connection = await amqplib.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const queue = "test-topic";

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from("Message from RabbitMQ producer!!"));
    console.log("Message sent!");
  } catch (error) {
    console.log(error);
  }
}

runProducer().catch(console.log);
