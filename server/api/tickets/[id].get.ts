import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const id   = parseInt(event.context.params!.id)

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy:   { select: { id: true, name: true } },
      assignedTo:  { select: { id: true, name: true } },
      attachments: { select: { id: true, url: true, filename: true } }
    }
  })

  if (!ticket) {
    throw createError({ statusCode: 404, message: 'Ticket no encontrado' })
  }

  if (user.role !== 'ADMIN' && ticket.createdById !== user.id) {
    throw createError({ statusCode: 403, message: 'No autorizado para ver este ticket' })
  }

  return ticket
})
