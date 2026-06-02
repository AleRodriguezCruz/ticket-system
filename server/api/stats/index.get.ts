import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const [byStatus, byPriority, byCategory, recent] = await Promise.all([
    prisma.ticket.groupBy({ by: ['status'],   _count: { id: true } }),
    prisma.ticket.groupBy({ by: ['priority'], _count: { id: true } }),
    prisma.ticket.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    }),
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*) as count
      FROM "Ticket"
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `
  ])

  return {
    byStatus:   byStatus.map(s   => ({ label: s.status,   count: s._count.id })),
    byPriority: byPriority.map(p => ({ label: p.priority, count: p._count.id })),
    byCategory: byCategory.map(c => ({ label: c.category, count: c._count.id })),
    monthly:    recent.map(r     => ({ month: r.month,    count: Number(r.count) }))
  }
})