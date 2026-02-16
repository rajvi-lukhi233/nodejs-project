import amqplib from 'amqplib';
let channel;
export const connectRabbitMQ = async () => {
  const connection = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertQueue('send_verification_email', {
    durable: true,
  });
};
export const getChannel = () => channel;
