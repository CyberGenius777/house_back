"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResidents = void 0;
const index_js_1 = require("../../generated/prisma/index.js");
const prisma = new index_js_1.PrismaClient();
const getResidents = async (req, res) => {
    try {
        const residents = await prisma.resident.findMany({
            select: {
                id: true,
                fullName: true,
                apartmentId: true,
                phone: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                fullName: 'asc',
            },
        });
        res.json(residents);
    }
    catch (error) {
        console.error('Error fetching residents:', error);
        res.status(500).json({ error: 'Ошибка сервера при получении жильцов' });
    }
};
exports.getResidents = getResidents;
