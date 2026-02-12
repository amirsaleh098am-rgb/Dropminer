import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/cache';

export class AppError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error but hide details in production if needed
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} - ${err.stack}`);
  } else {
    logger.warn(`${req.method} ${req.path} - ${message}`);
  }

  res.status(statusCode).json({
    status: 'error',
    message: message,
  });
};
