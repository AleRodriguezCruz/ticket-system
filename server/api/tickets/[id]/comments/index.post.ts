import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user     = event.context.user
  const ticketId = parseInt(getRouterParam(event, 'id') as string)
  const { text }  = await readBody(event)

  if (!text?.trim()) {
    throw createError({ statusCode: 400, message: 'El comentario no puede estar vacío' })
  }

  // Verificar que el ticket exista y que el usuario tenga acceso
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
  if (!ticket) throw createError({ statusCode: 404, message: 'Ticket no encontrado' })
  if (user.role !== 'ADMIN' && ticket.createdById !== user.id) {
    throw createError({ statusCode: 403, message: 'No autorizado' })
  }

  const comment = await prisma.comment.create({
    data: { text, author: user.name, ticketId }
  })

  return comment
})
