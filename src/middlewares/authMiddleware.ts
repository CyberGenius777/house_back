import type { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Нет токена' });
    return;  // Хитрость: возвращаем void, чтобы прекратить выполнение
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token) as { userId: string; role: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Неверный токен' });
    return;
  }
};
