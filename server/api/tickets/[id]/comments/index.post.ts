import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const ticketId = parseInt(getRouterParam(event, 'id') as string)
  const { text, author } = await readBody(event)
  if (!text) throw createError({ statusCode: 400, message: 'El comentario no puede estar vacío' })
  const comment = await prisma.comment.create({
    data: { text, author, ticketId }
  })
  return comment
})