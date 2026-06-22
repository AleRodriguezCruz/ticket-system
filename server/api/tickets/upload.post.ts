import { put } from '@vercel/blob'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const file     = formData.get('file') as File

  if (!file) {
    throw createError({ statusCode: 400, message: 'No se recibió ningún archivo' })
  }

  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowed.includes(file.type)) {
    throw createError({ statusCode: 400, message: 'Solo se permiten imágenes JPG, PNG, GIF o WEBP' })
  }

  if (file.size > 5 * 1024 * 1024) {
    throw createError({ statusCode: 400, message: 'La imagen no puede superar 5 MB' })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const blob = await put(`tickets/${Date.now()}-${safeName}`, file, { access: 'public' })

  return { url: blob.url, filename: file.name }
})
