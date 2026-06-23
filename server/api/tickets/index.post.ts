import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { title, description, category, priority, attachments } = body

  // Usar el usuario autenticado del token JWT (más seguro que confiar en el body)
  const user = event.context.user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

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
    include: {
      attachments: true
    }
  })

  return { ok: true, ticket }
})
