import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'commentId') as string)
  await prisma.comment.delete({ where: { id } })
  return { ok: true }
})