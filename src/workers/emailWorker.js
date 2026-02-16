import amqp from 'amqplib';
import { sendMail } from '../utils/sendMail.js';
import { getVerifyEmailTemplate } from '../utils/emailBody.js';

let channel;

export const startEmailWorker = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('send_verification_email', {
    durable: true,
  });
  channel.prefetch(1);
  console.log('Email worker started...');

  channel.consume(
    'send_verification_email',
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        const verifyLink = `${process.env.BASE_URL}/api/auth/verifyEmail/${data.verifyToken}`;
        const emailBody = getVerifyEmailTemplate(data.name, verifyLink);

        await sendMail(data.email, 'Verify Your Email', emailBody);

        console.log('✅ Verification email sent to:', data.email);

        channel.ack(msg);
      }
    },
    { noAck: false }
  );
};

startEmailWorker();
