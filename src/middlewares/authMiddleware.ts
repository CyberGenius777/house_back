import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt' // Путь к вашей функции проверки токена

interface UserPayload {
  userId: string
  role: string
}

export interface AuthRequest extends Request {
  user?: UserPayload
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization
  console.log('authHeader', authHeader)
  if (!authHeader) {
    res.status(401).json({ error: 'Нет токена' })
    return res.status(401).json({ error: 'Нет токена' })
  }

  const token = authHeader.split(' ')[1]
  console.log('token полученный', token)
  try {
    const decoded = verifyToken(token) as UserPayload
    console.log('decoded', decoded)
    req.user = decoded
    next()
  } catch (error) {
    console.error('Ошибка при проверке токена:', error) // Логируем ошибку
    res.status(401).json({ error: 'Неверный токен' })
    next(error) // Передаем ошибку дальше
  }
}
