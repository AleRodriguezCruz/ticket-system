import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id'))

  // Reasignar tickets del usuario antes de eliminarlo
  await prisma.ticket.updateMany({
    where: { assignedToId: id },
    data: { assignedToId: null }
  })

  await prisma.user.delete({ where: { id } })
  return { ok: true }
})