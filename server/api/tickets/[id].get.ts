import { prisma } from '~/server/utils/prisma'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) throw createError({ statusCode: 401, message: 'No autenticado' })

  const token = authHeader.replace('Bearer ', '')
  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!)
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido' })
  }

  const id = parseInt(event.context.params!.id)
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy:  { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  })

  if (!ticket) throw createError({ statusCode: 404, message: 'Ticket no encontrado' })

  // Usuario solo puede ver su propio ticket
  if (decoded.role !== 'ADMIN' && ticket.createdById !== decoded.id) {
    throw createError({ statusCode: 403, message: 'No autorizado' })
  }

  return ticket
})
