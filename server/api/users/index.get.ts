import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Acceso restringido a administradores' })
  }

  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
})
