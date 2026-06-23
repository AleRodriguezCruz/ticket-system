<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">Tickets</h1>
        <p class="text-xs mt-0.5" style="color:var(--muted)">
          {{ ticketsFiltrados.length }} {{ ticketsFiltrados.length === 1 ? 'resultado' : 'resultados' }}
        </p>
      </div>
      <NuxtLink to="/tickets/new" class="btn-primary">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nueva Incidencia
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-4 py-3 px-4">
      <div class="flex items-center gap-2.5 flex-wrap">
        <div class="flex items-center gap-1.5" style="color:var(--muted)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
          </svg>
          <span class="text-xs font-semibold uppercase tracking-wider">Filtros</span>
        </div>
        <div class="w-px h-4 mx-1" style="background:var(--border)"></div>

        <select v-model="filtros.status" class="input" style="width:140px;padding:6px 32px 6px 10px;font-size:12.5px">
          <option value="">Todos los estados</option>
          <option value="OPEN">Abierto</option>
          <option value="IN_PROGRESS">En progreso</option>
          <option value="CLOSED">Cerrado</option>
        </select>

        <select v-model="filtros.priority" class="input" style="width:140px;padding:6px 32px 6px 10px;font-size:12.5px">
          <option value="">Todas las prioridades</option>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </select>

        <select v-model="filtros.category" class="input" style="width:200px;padding:6px 32px 6px 10px;font-size:12.5px">
          <option value="">Todas las categorías</option>
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

        <div class="relative flex-1" style="min-width:160px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            class="absolute" style="left:10px;top:50%;transform:translateY(-50%);color:var(--muted-2)">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="filtros.search" class="input" style="padding-left:32px;padding-top:6px;padding-bottom:6px;font-size:12.5px"
            placeholder="Buscar incidencia..." />
        </div>

        <button v-if="filtros.status||filtros.priority||filtros.category||filtros.search"
          @click="clearFilters" class="btn-ghost text-xs">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Limpiar
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div class="table-container">
      <table class="w-full">
        <thead>
          <tr style="background:var(--surface2);border-bottom:1px solid var(--border-soft)">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:60px">#</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Título</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:120px">Estado</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:110px">Prioridad</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:180px">Categoría</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:140px">Asignado a</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:110px">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in ticketsFiltrados" :key="ticket.id"
            class="table-row"
            @click="navigateTo(`/tickets/${ticket.id}`)">
            <td class="px-4 py-3.5 text-xs font-mono font-medium" style="color:var(--muted-2)">#{{ ticket.id }}</td>
            <td class="px-4 py-3.5">
              <span class="text-sm font-medium" style="color:var(--text)">{{ ticket.title }}</span>
            </td>
            <td class="px-4 py-3.5"><StatusBadge :status="ticket.status" /></td>
            <td class="px-4 py-3.5"><PriorityBadge :priority="ticket.priority" /></td>
            <td class="px-4 py-3.5">
              <span class="text-xs px-2 py-1 rounded-md font-medium" style="background:var(--surface3);color:var(--muted)">
                {{ ticket.category }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <div v-if="ticket.assignedTo" class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                  style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
                  {{ ticket.assignedTo?.name?.charAt(0) }}
                </div>
                <span class="text-xs" style="color:var(--muted)">{{ ticket.assignedTo?.name }}</span>
              </div>
              <span v-else class="text-xs" style="color:var(--muted-2)">Sin asignar</span>
            </td>
            <td class="px-4 py-3.5 text-xs font-mono" style="color:var(--muted-2)">
              {{ new Date(ticket.createdAt).toLocaleDateString('es-MX') }}
            </td>
          </tr>
          <tr v-if="ticketsFiltrados.length === 0">
            <td colspan="7" style="background:var(--surface)">
              <div class="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                <p>No hay incidencias que mostrar</p>
                <p class="text-xs" style="color:var(--muted-2)">Intenta cambiar los filtros o crea una nueva incidencia</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

if (!auth.isLoggedIn) navigateTo('/login')

const { data: tickets } = await useFetch('/api/tickets', {
  headers: { Authorization: `Bearer ${auth.token}` }
})

const filtros = reactive({ status: '', priority: '', category: '', search: '' })

const ticketsFiltrados = computed(() =>
  (tickets.value || []).filter(t => {
    const matchStatus   = !filtros.status   || t.status   === filtros.status
    const matchPriority = !filtros.priority || t.priority === filtros.priority
    const matchCategory = !filtros.category || t.category === filtros.category
    const matchSearch   = !filtros.search   || t.title.toLowerCase().includes(filtros.search.toLowerCase())
    return matchStatus && matchPriority && matchCategory && matchSearch
  })
)

function clearFilters() {
  filtros.status = ''; filtros.priority = ''; filtros.category = ''; filtros.search = ''
}
</script>
