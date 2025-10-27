import { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware
 */
export const requestLogger = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.socket.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  next();
};

/**
 * Performance monitoring middleware
 */
export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Hook into response finish event
  res.on('finish', () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;

    if (duration > 1000) {
      console.warn(`⚠️  SLOW REQUEST: ${method} ${url} - ${duration}ms - Status: ${status}`);
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`✓ ${method} ${url} - ${duration}ms - Status: ${status}`);
    }
  });

  next();
};
