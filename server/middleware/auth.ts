import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const url = event.node.req.url || ''

  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password'
  ]
  if (publicRoutes.some(r => url.startsWith(r))) return
  if (!url.startsWith('/api/')) return

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'No autenticado' })
  }

  const token = authHeader.replace('Bearer ', '').trim()
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    event.context.user = decoded
  } catch {
    throw createError({ statusCode: 401, message: 'Token inválido o expirado' })
  }
})
