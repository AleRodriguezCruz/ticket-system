<template>
  <div class="max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <button @click="navigateTo('/tickets')" class="btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Volver
      </button>
      <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">Nueva Incidencia</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="card space-y-4">

      <div class="field">
        <label class="label">Título <span style="color:var(--danger)">*</span></label>
        <input v-model="form.title" class="input" placeholder="Describe brevemente el problema" required />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="field">
          <label class="label">Categoría <span style="color:var(--danger)">*</span></label>
          <select v-model="form.category" class="input" required>
            <option value="" disabled>Selecciona una categoría</option>
            <optgroup label="Epicor Kinetic">
              <option value="Configurador">Configurador (CPQ)</option>
              <option value="BAQ / Dashboard">BAQ / Dashboard</option>
              <option value="Method Directive / BPM">Method Directive / BPM</option>
              <option value="Customización">Customización de pantallas</option>
              <option value="Usuarios y Permisos">Usuarios y Permisos</option>
              <option value="Sincronización / Integración">Sincronización / Integración</option>
              <option value="Materiales">Materiales</option>
              <option value="Finanzas">Finanzas</option>
            </optgroup>
            <optgroup label="General">
              <option value="Otro">Otro</option>
            </optgroup>
          </select>
        </div>

        <div class="field">
          <label class="label">Prioridad <span style="color:var(--danger)">*</span></label>
          <select v-model="form.priority" class="input" required>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="label">Descripción <span style="color:var(--danger)">*</span></label>
        <textarea
          v-model="form.description"
          class="input resize-none"
          style="height:140px"
          placeholder="Describe el problema con el mayor detalle posible: qué intentabas hacer, qué error apareció, en qué módulo, etc."
          required
        />
      </div>

      <!-- Adjuntos -->
      <div class="field">
        <label class="label">Imágenes adjuntas (opcional)</label>
        <div
          class="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
          style="border-color:var(--border)"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFiles"
          />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-2" style="color:var(--muted)">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21,15 16,10 5,21"/>
          </svg>
          <p class="text-sm" style="color:var(--muted)">Arrastra imágenes aquí o haz clic para seleccionar</p>
          <p class="text-xs mt-1" style="color:var(--muted-2)">PNG, JPG, GIF, WEBP — máx. 5 MB por imagen</p>
        </div>

        <!-- Preview imágenes seleccionadas -->
        <div v-if="attachments.length > 0" class="flex flex-wrap gap-2 mt-3">
          <div v-for="(att, i) in attachments" :key="i" class="relative">
            <img
              :src="att.preview"
              class="w-16 h-16 object-cover rounded-lg"
              style="border:1px solid var(--border)"
            />
            <button
              type="button"
              @click="removeAttachment(i)"
              class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
              style="background:#ef4444;line-height:1"
            >✕</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="rounded-lg px-3 py-2.5 text-sm" style="background:rgba(220,38,38,0.1);color:#fca5a5;border:1px solid rgba(220,38,38,0.2)">
        {{ error }}
      </div>

      <div class="flex justify-end gap-2 pt-2" style="border-top:1px solid var(--border-soft)">
        <button type="button" @click="navigateTo('/tickets')" class="btn-secondary">Cancelar</button>
        <button type="submit" class="btn-primary" :disabled="loading">
          <svg v-if="loading" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          {{ uploadingFiles ? 'Subiendo imágenes...' : loading ? 'Creando...' : 'Crear Incidencia' }}
        </button>
      </div>

    </form>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth  = useAuthStore()
const route = useRoute()

// Redirigir si no está autenticado
if (!auth.isLoggedIn) navigateTo('/login')

const form = reactive({
  title:       '',
  description: '',
  category:    '',
  priority:    'MEDIUM'
})

const fileInput      = ref(null)
const attachments    = ref([])   // { file, preview }
const loading        = ref(false)
const uploadingFiles = ref(false)
const error          = ref('')

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFiles(e) {
  addFiles(Array.from(e.target.files))
  // Limpiar el input para permitir subir el mismo archivo de nuevo
  e.target.value = ''
}

function handleDrop(e) {
  addFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')))
}

function addFiles(files) {
  error.value = ''
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      error.value = `"${file.name}" supera el límite de 5 MB`
      continue
    }
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowed.includes(file.type)) {
      error.value = `"${file.name}" no es un tipo de imagen permitido`
      continue
    }
    attachments.value.push({ file, preview: URL.createObjectURL(file) })
  }
}

function removeAttachment(i) {
  URL.revokeObjectURL(attachments.value[i].preview)
  attachments.value.splice(i, 1)
}

async function handleSubmit() {
  loading.value = true
  error.value   = ''

  try {
    // 1. Subir imágenes primero (si hay)
    const uploadedUrls = []

    if (attachments.value.length > 0) {
      uploadingFiles.value = true
      for (const att of attachments.value) {
        const fd = new FormData()
        fd.append('file', att.file)
        const res = await $fetch('/api/tickets/upload', {
          method:  'POST',
          body:    fd,
          headers: { Authorization: `Bearer ${auth.token}` }
        })
        uploadedUrls.push({ url: res.url, filename: res.filename })
      }
      uploadingFiles.value = false
    }

    // 2. Crear el ticket con los adjuntos ya subidos
    await $fetch('/api/tickets', {
      method:  'POST',
      body:    { ...form, createdById: auth.user?.id, attachments: uploadedUrls },
      headers: { Authorization: `Bearer ${auth.token}` }
    })

    navigateTo('/tickets')
  } catch (e) {
    error.value = e?.data?.message || 'Error al crear el ticket'
  } finally {
    loading.value        = false
    uploadingFiles.value = false
  }
}
</script>
