import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user  = event.context.user
  const query = getQuery(event)

  const where: any = {}
  if (user.role !== 'ADMIN') {
    where.createdById = user.id
  }
  if (query.status)   where.status   = query.status
  if (query.priority) where.priority = query.priority
  if (query.category) where.category = query.category

  const tickets = await prisma.ticket.findMany({
    where,
    include: {
      createdBy:   { select: { id: true, name: true } },
      assignedTo:  { select: { id: true, name: true } },
      attachments: { select: { id: true, url: true, filename: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return tickets
})
