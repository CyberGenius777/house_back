// jwt.ts
import jwt from 'jsonwebtoken'

import { UserPayload } from '../middlewares/authMiddleware'

interface TokenPayload {
  userId: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, JWT_SECRET) as UserPayload
}
