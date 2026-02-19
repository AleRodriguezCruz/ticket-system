<template>
  <div class="max-w-3xl mx-auto" v-if="ticket">
    <div class="flex items-center gap-3 mb-6">
      <button @click="navigateTo('/tickets')" class="text-gray-400 hover:text-gray-600">← Volver</button>
      <h1 class="text-2xl font-bold">Ticket #{{ ticket.id }}</h1>
      <StatusBadge :status="ticket.status" />
      <PriorityBadge :priority="ticket.priority" />
    </div>

    <div class="space-y-5">
      <div class="card">
        <h2 class="font-semibold text-lg mb-1">{{ ticket.title }}</h2>
        <p class="text-gray-500 text-sm mb-4">
          Creado por <strong>{{ ticket.createdBy?.name }}</strong> el
          {{ new Date(ticket.createdAt).toLocaleDateString() }}
        </p>
        <p class="text-gray-700 whitespace-pre-wrap">{{ ticket.description }}</p>
        <div class="mt-3">
          <span class="bg-gray-100 px-2 py-1 rounded text-sm text-gray-500">📂 {{ ticket.category }}</span>
        </div>
      </div>

      <div class="card space-y-4" v-if="auth.user?.role !== 'USER'">
        <h3 class="font-semibold text-gray-700">⚙️ Gestión del Ticket</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Estado</label>
            <select v-model="gestion.status" class="input">
              <option value="OPEN">Abierto</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </div>
          <div>
            <label class="label">Prioridad</label>
            <select v-model="gestion.priority" class="input">
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica</option>
            </select>
          </div>
        </div>
        <div>
          <label class="label">Asignar a</label>
          <select v-model="gestion.assignedToId" class="input">
            <option :value="null">Sin asignar</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.role }})
            </option>
          </select>
        </div>
        <div v-if="gestion.status === 'CLOSED'">
          <label class="label">✅ Solución aplicada *</label>
          <textarea v-model="gestion.solution" class="input h-28 resize-none"
            placeholder="Describe cómo se resolvió el problema..." />
        </div>
        <div class="flex justify-end">
          <button @click="actualizarTicket" class="btn-primary" :disabled="guardando">
            {{ guardando ? 'Guardando...' : '💾 Guardar cambios' }}
          </button>
        </div>
      </div>

      <div class="card border-green-200 bg-green-50" v-if="ticket.solution">
        <h3 class="font-semibold text-green-700 mb-2">✅ Solución</h3>
        <p class="text-green-800 whitespace-pre-wrap">{{ ticket.solution }}</p>
        <p class="text-xs text-green-500 mt-2" v-if="ticket.closedAt">
          Cerrado el {{ new Date(ticket.closedAt).toLocaleDateString() }}
        </p>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center h-64 text-gray-400">
    Cargando ticket...
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const auth    = useAuthStore()
const route   = useRoute()
const guardando = ref(false)

const { data: ticket, refresh } = await useFetch(`/api/tickets/${route.params.id}`)
const { data: users }           = await useFetch('/api/users')

const gestion = reactive({
  status:       ticket.value?.status       || 'OPEN',
  priority:     ticket.value?.priority     || 'MEDIUM',
  assignedToId: ticket.value?.assignedToId || null,
  solution:     ticket.value?.solution     || ''
})

async function actualizarTicket() {
  if (gestion.status === 'CLOSED' && !gestion.solution.trim()) {
    alert('Por favor agrega la solución antes de cerrar el ticket')
    return
  }
  guardando.value = true
  try {
    await $fetch(`/api/tickets/${route.params.id}`, {
      method: 'PATCH',
      body: gestion
    })
    await refresh()
    alert('✅ Ticket actualizado correctamente')
  } catch (e) {
    alert('Error al actualizar el ticket')
  } finally {
    guardando.value = false
  }
}
</script>