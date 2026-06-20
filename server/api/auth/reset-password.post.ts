import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { token, password } = await readBody(event)

  if (!token || !password || password.length < 6) {
    throw createError({ statusCode: 400, message: 'Datos inválidos. La contraseña debe tener al menos 6 caracteres' })
  }

  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token, passwordResetExpires: { gt: new Date() } }
  })

  if (!user) {
    throw createError({ statusCode: 400, message: 'El enlace es inválido o ya expiró' })
  }

  const hashed = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, passwordResetToken: null, passwordResetExpires: null }
  })

  return { ok: true }
})
