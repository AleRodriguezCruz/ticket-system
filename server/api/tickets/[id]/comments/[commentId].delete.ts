import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (user.role === 'USER') {
    throw createError({ statusCode: 403, message: 'No autorizado' })
  }

  const commentId = parseInt(getRouterParam(event, 'commentId') as string)
  await prisma.comment.delete({ where: { id: commentId } })
  return { ok: true }
})
