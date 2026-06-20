import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Solo administradores pueden actualizar tickets' })
  }

  const id   = parseInt(event.context.params!.id)
  const body = await readBody(event)

  const data: any = {}
  if (body.status)       data.status       = body.status
  if (body.priority)     data.priority     = body.priority
  if (body.assignedToId !== undefined) data.assignedToId = body.assignedToId
  if (body.solution)     data.solution     = body.solution
  if (body.title)        data.title        = body.title
  if (body.description)  data.description  = body.description
  if (body.status === 'CLOSED') data.closedAt = new Date()

  const ticket = await prisma.ticket.update({
    where: { id },
    data,
    include: {
      createdBy:  { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  })

  // Si se cierra con solución, lo agregamos a la Base de Conocimiento
  if (body.status === 'CLOSED' && body.solution) {
    await prisma.knowledgeArticle.create({
      data: {
        title:    ticket.title,
        problem:  ticket.description,
        solution: body.solution,
        category: ticket.category,
        tags:     [ticket.category]
      }
    }).catch(() => {}) // no rompe el flujo si falla
  }

  return { ok: true, ticket }
})
