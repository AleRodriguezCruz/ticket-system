import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id)
  return prisma.knowledgeArticle.delete({ where: { id } })
})
