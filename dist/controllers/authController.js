"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
// Регистрация пользователя + создание резидента и привязка к квартире
exports.register = (async (req, res) => {
    try {
        const { login, password, fullName, apartmentId, phone, email, role = 'resident' } = req.body;
        // Проверить уникальность login и email
        const existingUser = await prisma.user.findUnique({ where: { login } });
        if (existingUser)
            return res.status(400).json({ error: 'Login уже используется' });
        if (email) {
            const existingEmail = await prisma.resident.findUnique({ where: { email } });
            if (existingEmail)
                return res.status(400).json({ error: 'Email уже используется' });
        }
        // Хэш пароля
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        // Создать User
        const user = await prisma.user.create({
            data: { login, password: hashedPassword, role },
        });
        // Создать Resident и связать с User и Apartment
        const resident = await prisma.resident.create({
            data: {
                fullName,
                phone,
                email,
                apartment: { connect: { id: apartmentId } },
                user: { connect: { id: user.id } },
            },
        });
        // Генерируем JWT
        const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
        res.json({ token, userId: user.id, role: user.role });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка регистрации' });
    }
});
// Логин
exports.login = (async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await prisma.user.findUnique({ where: { login } });
        if (!user)
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        const isValid = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!isValid)
            return res.status(400).json({ error: 'Неверный логин или пароль' });
        const token = (0, jwt_1.generateToken)({ userId: user.id, role: user.role });
        res.json({ token, userId: user.id, role: user.role });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка авторизации' });
    }
});
