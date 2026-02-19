import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id)

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy:  { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  })

  if (!ticket) {
    throw createError({ statusCode: 404, message: 'Ticket no encontrado' })
  }

  return ticket
})