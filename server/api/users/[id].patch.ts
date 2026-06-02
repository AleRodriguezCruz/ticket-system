import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const data: any = {}
  if (body.name) data.name = body.name
  if (body.email) data.email = body.email
  if (body.role) data.role = body.role
  if (body.password) data.password = await bcrypt.hash(body.password, 10)

  const user = await prisma.user.update({ where: { id }, data })
  return { ok: true, user }
})