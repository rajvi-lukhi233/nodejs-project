import express from 'express';
import indexRoute from './routes/index.js';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import perfLogx from 'perf-logx';
import { connectdb } from '../config/dbConfig.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(perfLogx());

const port = process.env.PORT;
import http from 'http';
import { initSocket } from './utils/socket.js';
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

connectdb();
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
