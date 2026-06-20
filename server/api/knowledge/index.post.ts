import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Acceso restringido a administradores' })
  }

  const body = await readBody(event)
  return prisma.knowledgeArticle.create({ data: body })
})
