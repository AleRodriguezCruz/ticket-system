import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const where: any = {}
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