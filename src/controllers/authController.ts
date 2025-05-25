import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

import { AuthRequest } from '../middlewares/authMiddleware'

import { hashPassword, comparePassword } from '../utils/bcrypt'
import { generateToken } from '../utils/jwt'

import { prisma } from '../prisma'

interface LoginRequestBody {
  login: string
  password: string
}

const RegisterSchema = z.object({
  login: z.string().min(3, 'Логин слишком короткий'),
  password: z.string().min(6, 'Пароль слишком короткий'),
  fullName: z.string().min(1, 'ФИО обязательно'),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional(),
  apartmentNumber: z.number().int().positive().optional(),
  entrance: z.number().int().positive().optional(),
  floor: z.number().int().optional(),
  role: z.enum(['resident', 'admin']).default('resident'),
})

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = RegisterSchema.safeParse(req.body)
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() })
      return
    }

    const { login, password, fullName, phone, email, apartmentNumber, entrance, floor, role } =
      parsed.data

    // Проверка уникальности login
    const existingUser = await prisma.user.findUnique({ where: { login } })
    if (existingUser) {
      res.status(400).json({ error: 'Такой логин уже существует' })
      return
    }

    // Проверка уникальности email
    if (email) {
      const existingEmail = await prisma.resident.findUnique({ where: { email } })
      if (existingEmail) {
        res.status(400).json({ error: 'такой email уже существует' })
        return
      }
    }

    const transactionResult = await prisma.$transaction(async (tx) => {
      let apartment = null

      // Если указаны apartmentNumber и entrance, ищем квартиру по уникальной паре
      if (apartmentNumber && entrance) {
        apartment = await tx.apartment.findFirst({
          where: { apartmentNumber, entrance },
        })

        if (!apartment) {
          apartment = await tx.apartment.create({
            data: {
              id: uuidv4(),
              apartmentNumber,
              entrance,
              floor,
            },
          })
        }
      }

      // Хеширование пароля
      const hashedPassword = await hashPassword(password)

      // Создание пользователя
      const user = await tx.user.create({
        data: {
          id: uuidv4(),
          login,
          password: hashedPassword,
          role,
        },
      })

      // Создание жильца
      await tx.resident.create({
        data: {
          id: uuidv4(),
          fullName,
          phone,
          email,
          ownerType: 'owner',
          animals: [],
          user: { connect: { id: user.id } },
          ...(apartment && { apartment: { connect: { id: apartment.id } } }),
        },
      })

      return user
    })

    const token = generateToken({
      userId: transactionResult.id,
      role: transactionResult.role,
    })

    res.json({
      token,
      userId: transactionResult.id,
      role: transactionResult.role,
    })
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    res.status(500).json({ error: 'Ошибка регистрации' })
  }
}
export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
): Promise<void> => {
  try {
    const parsed = z
      .object({
        login: z.string().min(1),
        password: z.string().min(1),
      })
      .safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.format() })
      return
    }

    const { login, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { login } })
    if (!user) {
      res.status(400).json({ error: 'Такого пользователя не существует' })
      return
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      res.status(400).json({ error: 'Неверный логин или пароль' })
      return
    }

    const token = generateToken({ userId: user.id, role: user.role })
    res
      .cookie('token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ token, userId: user.id, role: user.role })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Ошибка авторизации' })
  }
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Пользователь не авторизован' })
    return
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { resident: { include: { apartment: true } } },
  })

  if (!user) {
    res.status(404).json({ error: 'Пользователь не найден' })
    return
  }

  res.status(200).json({
    id: user.id,
    login: user.login,
    role: user.role,
    fullName: user.resident?.fullName,
    apartment: user.resident?.apartment,
  })
}
