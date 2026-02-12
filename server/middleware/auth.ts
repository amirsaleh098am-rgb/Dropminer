import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/cache';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_12345';

declare global {
  namespace Express {
    interface Request {
      user?: {
        tg_id: number;
        username: string;
        iat: number;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (!decoded.tg_id) {
        throw new Error('Invalid token payload');
      }

      req.user = {
        tg_id: decoded.tg_id,
        username: decoded.username || '',
        iat: decoded.iat,
      };

      next();
    } catch (err: any) {
      logger.warn(`JWT verification failed: ${err.message}`);
      return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Authentication error' });
  }
};
