import { NextFunction, Request, Response } from 'express';

const token = process.env.API_TOKEN ?? 'fortress-hub-api-token';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  const providedToken = authHeader.split(' ')[1];
  if (providedToken !== token) {
    return res.status(403).json({ error: 'Invalid authorization token' });
  }

  next();
}
