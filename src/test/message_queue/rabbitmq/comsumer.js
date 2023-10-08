const amqplib = require("amqplib");

async function runComsumer() {
  try {
    const connection = await amqplib.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const queue = "test-topic";
    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      (msg) => {
        console.log("Received message: ");
        console.log(msg.content.toString());
      },
      { noAck: false }
    );
  } catch (error) {
    console.log(error);
  }
}

runComsumer().catch(console.log);
