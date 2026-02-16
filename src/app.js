import express from 'express';
import indexRoute from './routes/index.js';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import perfLogx from 'perf-logx';
import { connectdb } from '../config/dbConfig.js';
import { fileURLToPath } from 'url';
import { client, connectRedis } from '../config/redisConfig.js';
import '../config/passportConfig.js';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(perfLogx());

app.use(passport.initialize());

const port = process.env.PORT;
import http from 'http';
import { initSocket } from './utils/socket.js';
import { errorResponse, successResponse } from './utils/resUtil.js';
import mongoose from 'mongoose';
import { connectRabbitMQ } from '../config/rabbitmqConfig.js';
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connectdb();
connectRedis();
connectRabbitMQ();

app.get('/health', async (req, res) => {
  try {
    const redisConnected = client.isOpen;
    const mongoConnected = mongoose.connection.readyState === 1;

    if (!redisConnected || !mongoConnected) {
      return errorResponse(res, 500, 'unhealthy.', {
        status: 'ERROR',
        redis: 'disconnected',
      });
    }
    return successResponse(res, 200, 'healthy.', {
      status: 'OK',
      redis: 'connected',
      uptime: process.uptime(),
    });
  } catch (error) {
    return errorResponse(res, 500, 'Interal server error.', {
      error: error.message,
    });
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  // standardHeaders: true,
  // legacyHeaders: false,
});
initSocket(io);
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(limiter);
app.use('/api', indexRoute);
server.listen(port, () => {
  console.log(`Server start on port ${port}`);
});

async function gracefulShutdown() {
  console.log('Shutting down gracefully...');

  server.close(async () => {
    console.log('Closed HTTP server');

    await mongoose.disconnect();
    console.log('MongoDB connection closed');

    process.exit(0);
  });
}

// Listen for termination signals
process.on('SIGINT', gracefulShutdown); // Ctrl + C
