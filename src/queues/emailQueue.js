import { Queue } from 'bullmq';
import { connectRedis } from '../../config/redisConfig.js';

export const emailQueue = new Queue('emailQueue', { connection: connectRedis });
