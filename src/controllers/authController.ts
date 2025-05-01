import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

interface RegisterRequestBody {
  login: string;
  password: string;
  fullName: string;
  apartmentNumber?: number;
  floor?: number;
  phone?: string;
  email?: string;
  role?: 'resident' | 'admin';
}

interface LoginRequestBody {
  login: string;
  password: string;
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const {
      login,
      password,
      fullName,
      apartmentNumber = '',
      floor,
      phone,
      email,
      role = 'resident',
    } = req.body;

    // Проверить уникальность login
    const existingUser = await prisma.user.findUnique({ where: { login } });
    if (existingUser) {
      res.status(400).json({ error: 'Логин уже используется' });
      return;
    }

    // Проверить уникальность email
    if (email) {
      const existingEmail = await prisma.resident.findUnique({ where: { email } });
      if (existingEmail) {
        res.status(400).json({ error: 'Email уже используется' });
        return;
      }
    }

    if (apartmentNumber) {

    let apartment = await prisma.apartment.findUnique({where: { apartmentNumber } });

    if (!apartment) {
      apartment = await prisma.apartment.create({
        data: {
          id: uuidv4(), // Генерируем apartmentId автоматически
          apartmentNumber,
          floor,
        },
      });
    }
  }

    // Хэш пароля
    const hashedPassword = await hashPassword(password);

    // Создать пользователя
    const user = await prisma.user.create({
      data: { login, password: hashedPassword, role },
    });


    

    // Создать жильца и привязать к квартире
    await prisma.resident.create({
      data: {
        id: uuidv4(),
        fullName,
        phone,
        email,
        user: { connect: { id: user.id } },
        ...(apartment && {apartment: { connect: { id: apartment.id } }}), // Связь через apartmentId
      },
    });

    // Генерируем JWT
    const token = generateToken({ userId: user.id, role: user.role });

    res.json({ token, userId: user.id, role: user.role });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { login, password } = req.body;
    const user = await prisma.user.findUnique({ where: { login } });
    if (!user) {
      res.status(400).json({ error: 'Неверный логин или пароль' });
      return;
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      res.status(400).json({ error: 'Неверный логин или пароль' });
      return;
    }

    const token = generateToken({ userId: user.id, role: user.role });
    res.json({ token, userId: user.id, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка авторизации' });
  }
};
