import amqp from 'amqplib';
import { sendMail } from '../utils/sendMail.js';
import { getVerifyEmailTemplate } from '../utils/emailBody.js';

export const startEmailWorker = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
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

//------------------------using bullmq----------------------------//

// import { Worker } from 'bullmq';
// import { connectRedis } from '../../config/redisConfig.js';

// const worker = new Worker(
//   'emailQueue',
//   async (job) => {
//     if (job.name === 'sendVerificationEmail') {
//       const { name, email, verifyToken } = job.data;
//       const verifyLink = `${process.env.BASE_URL}/api/auth/verifyEmail/${verifyToken}`;
//       const emailBody = getVerifyEmailTemplate(name, verifyLink);
//       await sendMail(email, 'Verify Your Email', emailBody);
//       console.log('Email sent to:', email);
//     }
//   },
//   { connection: connectRedis }
// );

// worker.on('completed', (job) => {
//   console.log(`Job ${job.id} completed`);
// });

// worker.on('failed', (job, err) => {
//   console.log(`Job failed:`, err);
// });
