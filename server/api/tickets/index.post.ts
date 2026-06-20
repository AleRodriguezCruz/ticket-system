import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  const body = await readBody(event)
  const { title, description, category, priority, attachments } = body

  if (!title || !description || !category || !priority) {
    throw createError({ statusCode: 400, message: 'Faltan campos requeridos' })
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      category,
      priority,
      createdById: user.id,
      ...(attachments?.length > 0 && {
        attachments: {
          create: attachments.map((a: any) => ({
            url:      a.url,
            filename: a.filename
          }))
        }
      })
    },
    include: { attachments: true }
  })

  return { ok: true, ticket }
})
