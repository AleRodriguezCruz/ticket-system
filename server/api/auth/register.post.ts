import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, password, role } = body

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, message: 'Todos los campos son requeridos' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, message: 'El email ya está registrado' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role || 'AGENT' },
    select: { id: true, name: true, email: true, role: true }
  })

  return { ok: true, user }
})