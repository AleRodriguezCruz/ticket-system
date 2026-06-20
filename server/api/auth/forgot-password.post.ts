import { prisma } from '~/server/utils/prisma'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { ok: true } // no revelamos si el email existe

  const token   = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hora

  await prisma.user.update({
    where: { email },
    data: { passwordResetToken: token, passwordResetExpires: expires }
  })

  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`

  await resend.emails.send({
    from: 'soporte@tudominio.com', // cambia por tu dominio verificado en Resend
    to: email,
    subject: 'Recuperación de contraseña — TicketSystem',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#1a56db">Recuperar contraseña</h2>
        <p>Hola ${user.name}, recibimos una solicitud para restablecer tu contraseña.</p>
        <p>
          <a href="${resetUrl}" style="background:#1a56db;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block">
            Restablecer contraseña
          </a>
        </p>
        <p style="color:#666;font-size:13px">Este enlace expira en 1 hora. Si no solicitaste esto, ignora este correo.</p>
      </div>
    `
  })

  return { ok: true }
})
