import { createClient } from 'redis';

// const client = createClient({
//   url: process.env.REDIS_URL,
// });

const client = createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
});

client.on('error', (err) => {
  console.log('❌ Redis Error:', err);
});

const connectRedis = async () => {
  await client.connect();
  console.log('✅ Redis Connected');
};

export { client, connectRedis };
