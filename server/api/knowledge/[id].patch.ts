import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id   = parseInt(event.context.params!.id)
  const body = await readBody(event)
  // increment views
  if (body._view) {
    return prisma.knowledgeArticle.update({ where: { id }, data: { views: { increment: 1 } } })
  }
  if (body._helpful) {
    return prisma.knowledgeArticle.update({ where: { id }, data: { helpful: { increment: 1 } } })
  }
  return prisma.knowledgeArticle.update({ where: { id }, data: body })
})
