import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const where: any = {}
  if (query.category) where.category = query.category
  if (query.search) {
    where.OR = [
      { title:    { contains: query.search as string, mode: 'insensitive' } },
      { problem:  { contains: query.search as string, mode: 'insensitive' } },
      { solution: { contains: query.search as string, mode: 'insensitive' } },
      { tags:     { has: query.search as string } }
    ]
  }
  return prisma.knowledgeArticle.findMany({
    where,
    orderBy: { views: 'desc' }
  })
})
