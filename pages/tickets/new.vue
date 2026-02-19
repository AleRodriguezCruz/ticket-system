<template>
  <div class="max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <button @click="navigateTo('/tickets')" class="text-xs px-3 py-1.5 rounded-lg transition-colors" style="color: var(--muted); border: 1px solid var(--border)">← Volver</button>
      <div>
        <h1 class="text-lg font-semibold" style="color: var(--text)">Nuevo Ticket</h1>
        <p class="text-xs" style="color: var(--muted)">Reporta un nuevo problema o incidencia</p>
      </div>
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="label">Título</label>
          <input v-model="form.title" class="input" placeholder="Descripción corta del problema" required />
        </div>

        <div>
          <label class="label">Descripción</label>
          <textarea v-model="form.description" class="input h-28 resize-none" placeholder="Explica el problema en detalle..." required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Categoría</label>
            <select v-model="form.category" class="input" required>
              <option value="">Seleccionar...</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Red">Red</option>
              <option value="Accesos">Accesos</option>
              <option value="Impresoras">Impresoras</option>
              <option value="Correo">Correo</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label class="label">Prioridad</label>
            <select v-model="form.priority" class="input" required>
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica</option>
            </select>
          </div>
        </div>

        <div v-if="error" class="rounded-lg px-3 py-2 text-xs" style="background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2)">
          {{ error }}
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="navigateTo('/tickets')" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Creando...' : 'Crear Ticket' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const auth    = useAuthStore()
const error   = ref('')
const loading = ref(false)
const form    = reactive({ title: '', description: '', category: '', priority: 'MEDIUM' })

async function handleSubmit() {
  loading.value = true
  error.value   = ''
  try {
    await $fetch('/api/tickets', {
      method: 'POST',
      body: { ...form, createdById: auth.user?.id }
    })
    navigateTo('/tickets')
  } catch (e) {
    error.value = e?.data?.message || 'Error al crear el ticket'
  } finally {
    loading.value = false
  }
}
</script>