import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Acceso restringido a administradores' })
  }

  const query = getQuery(event)
  const where: any = {}
  if (query.category) where.category = query.category
  if (query.search) {
    where.OR = [
      { title:    { contains: query.search as string, mode: 'insensitive' } },
      { problem:  { contains: query.search as string, mode: 'insensitive' } },
      { solution: { contains: query.search as string, mode: 'insensitive' } }
    ]
  }

  return prisma.knowledgeArticle.findMany({ where, orderBy: { views: 'desc' } })
})
