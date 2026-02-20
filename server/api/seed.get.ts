
import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async () => {
  const hash = await bcrypt.hash('Admin1234!', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: { password: hash }, // Esto actualiza la contraseña si ya existe
    create: {
      name: 'Administrador',
      email: 'admin@empresa.com',
      password: hash,
      role: 'ADMIN'
    }
  })
  
  return { ok: true, message: 'Usuario administrador actualizado con éxito' }
})