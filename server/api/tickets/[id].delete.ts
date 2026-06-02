import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') as string)
  await prisma.ticket.delete({ where: { id } })
  return { ok: true }
})