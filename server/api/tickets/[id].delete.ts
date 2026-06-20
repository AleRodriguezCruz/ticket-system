import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Solo administradores pueden eliminar tickets' })
  }

  const id = parseInt(getRouterParam(event, 'id') as string)
  await prisma.ticket.delete({ where: { id } })
  return { ok: true }
})
