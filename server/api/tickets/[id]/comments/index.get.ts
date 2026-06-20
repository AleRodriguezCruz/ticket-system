import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user     = event.context.user
  const ticketId = parseInt(getRouterParam(event, 'id') as string)

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
  if (!ticket) throw createError({ statusCode: 404, message: 'Ticket no encontrado' })
  if (user.role !== 'ADMIN' && ticket.createdById !== user.id) {
    throw createError({ statusCode: 403, message: 'No autorizado' })
  }

  return prisma.comment.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' }
  })
})
