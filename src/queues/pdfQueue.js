import { Queue } from 'bullmq';
import { connectRedis } from '../../config/redisConfig.js';

export const pdfQueue = new Queue('pdfQueue', { connection: connectRedis });
