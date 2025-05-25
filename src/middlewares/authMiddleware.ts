import { Request, Response, NextFunction } from 'express'

import { verifyToken } from '../utils/jwt'

export interface UserPayload {
  userId: string
  role: string
}

export interface AuthRequest extends Request {
  user?: UserPayload
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1] || req.cookies?.token

  if (!token) {
    res.status(401).json({ error: 'Нет токена' })
    return
  }

  try {
    const decoded = verifyToken(token) as UserPayload
    req.user = decoded
    next()
  } catch (error) {
    console.error('Ошибка проверки токена:', error)
    res.status(401).json({ error: 'Неверный токен' })
  }
}
