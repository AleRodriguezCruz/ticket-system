import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const where = user.role === 'USER' ? { createdById: user.id } : {}

  const [open, inProgress, closed] = await Promise.all([
    prisma.ticket.count({ where: { ...where, status: 'OPEN' } }),
    prisma.ticket.count({ where: { ...where, status: 'IN_PROGRESS' } }),
    prisma.ticket.count({ where: { ...where, status: 'CLOSED' } }),
  ])

  return {
    byStatus: { OPEN: open, IN_PROGRESS: inProgress, CLOSED: closed },
    total: open + inProgress + closed
  }
})
