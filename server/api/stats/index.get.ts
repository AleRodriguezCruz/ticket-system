import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user  = event.context.user
  const where = user.role !== 'ADMIN' ? { createdById: user.id } : {}

  const [byStatus, byPriority, byCategory] = await Promise.all([
    prisma.ticket.groupBy({ by: ['status'],   where, _count: { id: true } }),
    prisma.ticket.groupBy({ by: ['priority'], where, _count: { id: true } }),
    prisma.ticket.groupBy({
      by: ['category'], where, _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    })
  ])

  return {
    byStatus:   byStatus.map(s   => ({ label: s.status,   count: s._count.id })),
    byPriority: byPriority.map(p => ({ label: p.priority, count: p._count.id })),
    byCategory: byCategory.map(c => ({ label: c.category, count: c._count.id }))
  }
})
