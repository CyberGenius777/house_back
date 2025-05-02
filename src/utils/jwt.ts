// jwt.ts
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}
