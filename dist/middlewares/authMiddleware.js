"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Нет токена' });
        return; // Хитрость: возвращаем void, чтобы прекратить выполнение
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ error: 'Неверный токен' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
