import { createClient } from 'redis';
import winston from 'winston';

// Simple Logger Wrapper
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

let redisClient: any = null;

export async function initRedis() {
  if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL not set, caching disabled');
    return;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis connection failed after 10 attempts');
            return new Error('Redis connection failed');
          }
          return retries * 100;
        },
      },
    });

    redisClient.on('error', (err: any) => {
      logger.error(`Redis error: ${err.message}`);
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected');
    });

    await redisClient.connect();
  } catch (err) {
    logger.warn(`Failed to initialize Redis: ${err}`);
    redisClient = null;
  }
}

export async function getCache(key: string): Promise<any | null> {
  try {
    if (!redisClient) return null;
    const value = await redisClient.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  } catch (err) {
    logger.warn(`Cache get error for key ${key}: ${err}`);
    return null;
  }
}

export async function setCache(key: string, value: any, expiresIn: number = 300): Promise<void> {
  try {
    if (!redisClient) return;
    await redisClient.setEx(key, expiresIn, JSON.stringify(value));
  } catch (err) {
    logger.warn(`Cache set error for key ${key}: ${err}`);
  }
}

export async function invalidateUserCache(tg_id: number): Promise<void> {
  try {
    if (!redisClient) return;
    const keys = [`user:${tg_id}`, `user:${tg_id}:stats`];
    for (const key of keys) {
      await redisClient.del(key);
    }
  } catch (err) {
    logger.warn(`Cache invalidation error for user ${tg_id}: ${err}`);
  }
}
