import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  assertMethod(event, ['POST'])
  
  const body = await readBody(event)
  const { subject, from, textContent, category } = body

  try {
    // 1. Lógica de Usuario (Buscar o Crear)
    let user = await prisma.user.findUnique({ where: { email: from } })

    if (!user) {
      const temporaryPassword = await bcrypt.hash('Temporal123!', 10)
      user = await prisma.user.create({
        data: {
          email: from,
          name: from.split('@')[0],
          password: temporaryPassword,
          role: 'USER'
        }
      })
    }

    // 2. Creación del Ticket con los campos obligatorios de tu schema
    const ticket = await prisma.ticket.create({
      data: {
        title: subject || 'Ticket desde Outlook',
        description: textContent || 'Sin descripción',
        category: category || 'Soporte Correo',
        status: 'OPEN',
        priority: 'MEDIUM',
        createdById: user.id 
      }
    })

    // 3. NOTIFICACIÓN AL ADMINISTRADOR
    // Aquí podrías integrar un servicio como Resend para enviar un correo real
    console.log(`📢 NUEVO TICKET: #${ticket.id} - Asunto: ${ticket.title} (Remitente: ${from})`)

    return { 
      ok: true, 
      message: 'Ticket creado y Admin notificado',
      ticketId: ticket.id 
    }

  } catch (error) {
    console.error('🔴 Error en Webhook:', error)
    throw createError({ statusCode: 500, message: 'Error al procesar' })
  }
})