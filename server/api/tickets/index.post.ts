import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, description, category, priority, createdById } = body

  if (!title || !description || !category || !createdById) {
    throw createError({ statusCode: 400, message: 'Faltan campos requeridos' })
  }

  const ticket = await prisma.ticket.create({
    data: { title, description, category, priority, createdById }
  })

  return { ok: true, ticket }
})