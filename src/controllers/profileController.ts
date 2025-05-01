import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import { PrismaClient } from '../../generated/prisma';


const prisma = new PrismaClient();
const router = express.Router();

router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Нет доступа' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: { resident: { include: { apartment: true } } },
  });

  if (!user) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }

  res.json({
    login: user.login,
    role: user.role,
    fullName: user.resident?.fullName,
    apartment: user.resident?.apartment,
  });
});

export default router;
