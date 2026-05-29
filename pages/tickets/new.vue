<template>
  <div class="max-w-2xl">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="navigateTo('/tickets')" class="btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Volver
      </button>
      <div class="w-px h-4" style="background:var(--border)"></div>
      <div>
        <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">Nueva Incidencia</h1>
        <p class="text-xs" style="color:var(--muted)">Reporta un nuevo problema relacionado con Epicor Kinetic</p>
      </div>
    </div>

    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-5">

        <div class="field">
          <label class="label">Título de la incidencia</label>
          <input v-model="form.title" class="input" placeholder="Ej: Error en configurador de cotización al aplicar descuento" required />
        </div>

        <div class="field">
          <label class="label">Descripción detallada</label>
          <textarea v-model="form.description" class="input resize-none" style="height:110px"
            placeholder="Describe el problema con detalle: ¿Qué intentabas hacer? ¿Qué mensaje de error aparece? ¿Con qué frecuencia ocurre?" required />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label class="label">Categoría</label>
            <select v-model="form.category" class="input" required>
              <option value="" disabled>Seleccionar categoría...</option>
              <optgroup label="Epicor Kinetic">
                <option value="Configurador">Configurador (CPQ)</option>
                <option value="BAQ / Dashboard">BAQ / Dashboard</option>
                <option value="Method Directive / BPM">Method Directive / BPM</option>
                <option value="Customización">Customización de pantallas</option>
                <option value="Usuarios y Permisos">Usuarios y Permisos</option>
                <option value="Sincronización / Integración">Sincronización / Integración</option>
                <option value="Materiales">Materiales</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Jobs">Jobs / Órdenes de Trabajo</option>
              </optgroup>
              <optgroup label="General">
                <option value="Otro">Otro</option>
              </optgroup>
            </select>
          </div>
          <div class="field">
            <label class="label">Prioridad</label>
            <select v-model="form.priority" class="input" required>
              <option value="LOW">Baja — Sin impacto inmediato</option>
              <option value="MEDIUM">Media — Impacto moderado</option>
              <option value="HIGH">Alta — Afecta operaciones</option>
              <option value="CRITICAL">Crítica — Sistema detenido</option>
            </select>
          </div>
        </div>

        <!-- Priority hint -->
        <div class="rounded-lg px-4 py-3 flex items-start gap-3" style="background:var(--accent-soft);border:1px solid rgba(26,86,219,0.12)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2" class="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p class="text-xs" style="color:#1648c0;line-height:1.5">
            Tu incidencia será revisada por el equipo de soporte. Recibirás actualizaciones conforme avance la resolución.
            Las incidencias críticas se atienden con máxima prioridad.
          </p>
        </div>

        <div v-if="error" class="alert-error">{{ error }}</div>

        <div class="flex justify-end gap-2 pt-1">
          <button type="button" @click="navigateTo('/tickets')" class="btn-secondary">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <svg v-if="loading" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ loading ? 'Creando...' : 'Crear Incidencia' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
</style>

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
