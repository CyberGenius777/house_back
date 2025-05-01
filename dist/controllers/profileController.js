"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get('/profile', authMiddleware_1.authMiddleware, async (req, res) => {
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
exports.default = router;
