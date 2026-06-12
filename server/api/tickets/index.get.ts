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

  const query = getQuery(event)
  const where: any = {}

  // Si no es admin, solo ve SUS tickets
  if (decoded.role !== 'ADMIN') {
    where.createdById = decoded.id
  }

  if (query.status)   where.status   = query.status
  if (query.priority) where.priority = query.priority
  if (query.category) where.category = query.category

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      createdBy:  { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return tickets
})
