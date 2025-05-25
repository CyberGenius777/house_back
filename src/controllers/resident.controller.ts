import { prisma } from '../prisma'

export const getResidents = async (req: any, res: any) => {
  try {
    const residents = await prisma.resident.findMany({
      select: {
        id: true,
        fullName: true,
        apartmentId: true,
        phone: true,
        email: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    })
    res.json(residents)
  } catch (error) {
    console.error('Error fetching residents:', error)
    res.status(500).json({ error: 'Ошибка сервера при получении жильцов' })
  }
}
