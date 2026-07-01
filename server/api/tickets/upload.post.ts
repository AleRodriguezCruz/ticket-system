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

  try {
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    return { url: dataUrl, filename: file.name }
  } catch (err: any) {
    console.error('Error procesando imagen:', err?.message || err)
    throw createError({
      statusCode: 500,
      message: err?.message || 'Error al procesar la imagen'
    })
  }
})
