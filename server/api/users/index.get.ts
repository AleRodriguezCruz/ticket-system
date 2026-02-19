import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
  return users
})