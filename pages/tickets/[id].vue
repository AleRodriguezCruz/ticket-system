<template>
  <div class="max-w-3xl mx-auto" v-if="ticket">
    <div class="flex items-center gap-3 mb-6">
      <button @click="navigateTo('/tickets')" class="text-xs px-3 py-1.5 rounded-lg transition-colors"
        style="color: var(--muted); border: 1px solid var(--border)">← Volver</button>
      <h1 class="text-lg font-semibold" style="color: var(--text)">Ticket #{{ ticket.id }}</h1>
      <StatusBadge :status="ticket.status" />
      <PriorityBadge :priority="ticket.priority" />

      <!-- Botón eliminar solo ADMIN -->
      <button v-if="auth.user?.role === 'ADMIN'" @click="showDelete = true"
        class="ml-auto text-xs px-3 py-1.5 rounded-lg transition-colors"
        style="border: 1px solid #fecaca; color: #dc2626; background: #fef2f2"
        onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fef2f2'">
        🗑 Eliminar ticket
      </button>
    </div>

    <div class="space-y-5">
      <!-- Info del ticket -->
      <div class="card">
        <h2 class="font-semibold text-lg mb-1" style="color: var(--text)">{{ ticket.title }}</h2>
        <p class="text-sm mb-4" style="color: var(--muted)">
          Creado por <strong>{{ ticket.createdBy?.name }}</strong> el
          {{ new Date(ticket.createdAt).toLocaleDateString() }}
        </p>
        <p class="whitespace-pre-wrap text-sm" style="color: var(--text)">{{ ticket.description }}</p>
        <div class="mt-3">
          <span class="text-xs px-2 py-1 rounded" style="background: var(--surface2); color: var(--muted)">
            📂 {{ ticket.category }}
          </span>
        </div>
      </div>

      <!-- Gestión -->
      <div class="card space-y-4" v-if="auth.user?.role !== 'USER'">
        <h3 class="font-semibold" style="color: var(--text)">⚙️ Gestión del Ticket</h3>
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

      <!-- Solución -->
      <div class="card" v-if="ticket.solution"
        style="border: 1px solid #bbf7d0; background: #f0fdf4">
        <h3 class="font-semibold mb-2" style="color: #15803d">✅ Solución</h3>
        <p class="whitespace-pre-wrap text-sm" style="color: #166534">{{ ticket.solution }}</p>
        <p class="text-xs mt-2" style="color: #4ade80" v-if="ticket.closedAt">
          Cerrado el {{ new Date(ticket.closedAt).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <!-- MODAL CONFIRMAR ELIMINAR -->
    <div v-if="showDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.5)" @click.self="showDelete = false">
      <div class="w-full max-w-sm rounded-xl p-6"
        style="background: var(--surface); border: 1px solid var(--border)">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style="background: #fef2f2">
            <span style="color: #dc2626; font-size: 18px">⚠</span>
          </div>
          <div>
            <h2 class="text-sm font-semibold" style="color: var(--text)">Eliminar ticket</h2>
            <p class="text-xs" style="color: var(--muted)">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p class="text-sm mb-4" style="color: var(--muted)">
          ¿Estás seguro que deseas eliminar el ticket
          <strong style="color: var(--text)">#{{ ticket.id }} — {{ ticket.title }}</strong>?
        </p>
        <div v-if="deleteError" class="rounded-md px-3 py-2 text-xs mb-3"
          style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca">
          {{ deleteError }}
        </div>
        <div class="flex justify-end gap-2">
          <button @click="showDelete = false" class="btn-secondary">Cancelar</button>
          <button @click="eliminarTicket" class="btn-primary" :disabled="eliminando"
            style="background: #dc2626"
            onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
            {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex items-center justify-center h-64" style="color: var(--muted)">
    Cargando ticket...
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const auth      = useAuthStore()
const route     = useRoute()
const guardando = ref(false)
const showDelete  = ref(false)
const eliminando  = ref(false)
const deleteError = ref('')

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

async function eliminarTicket() {
  eliminando.value  = true
  deleteError.value = ''
  try {
    await $fetch(`/api/tickets/${route.params.id}`, { method: 'DELETE' })
    navigateTo('/tickets')
  } catch (e) {
    deleteError.value = e?.data?.message || 'Error al eliminar el ticket'
  } finally {
    eliminando.value = false
  }
}
</script>