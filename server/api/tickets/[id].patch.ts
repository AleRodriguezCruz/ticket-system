import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id   = parseInt(event.context.params!.id)
  const body = await readBody(event)

  const data: any = {}
  if (body.status)       data.status       = body.status
  if (body.priority)     data.priority     = body.priority
  if (body.assignedToId) data.assignedToId = body.assignedToId
  if (body.solution)     data.solution     = body.solution
  if (body.title)        data.title        = body.title
  if (body.description)  data.description  = body.description

  if (body.status === 'CLOSED') {
    data.closedAt = new Date()
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data,
    include: {
      createdBy:  { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true } }
    }
  })

  return { ok: true, ticket }
})