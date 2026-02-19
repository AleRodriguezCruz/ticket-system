import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async () => {
  const count = await prisma.user.count()
  if (count > 0) {
    return { message: 'Ya existen usuarios' }
  }
  const hash = await bcrypt.hash('Admin1234!', 10)
  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@empresa.com',
      password: hash,
      role: 'ADMIN'
    }
  })
  return { ok: true }
})