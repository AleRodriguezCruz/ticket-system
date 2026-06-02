import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const ticketId = parseInt(getRouterParam(event, 'id') as string)
  const comments = await prisma.comment.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' }
  })
  return comments
})