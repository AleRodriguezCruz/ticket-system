<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-lg font-semibold" style="color: var(--text)">Tickets</h1>
        <p class="text-xs mt-0.5" style="color: var(--muted)">{{ ticketsFiltrados.length }} resultados</p>
      </div>
      <NuxtLink to="/tickets/new" class="btn-primary">+ Nuevo</NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="flex gap-2 mb-5">
      <select v-model="filtros.status" class="input w-36">
        <option value="">Todos</option>
        <option value="OPEN">Abierto</option>
        <option value="IN_PROGRESS">En progreso</option>
        <option value="CLOSED">Cerrado</option>
      </select>
      <select v-model="filtros.priority" class="input w-36">
        <option value="">Prioridad</option>
        <option value="LOW">Baja</option>
        <option value="MEDIUM">Media</option>
        <option value="HIGH">Alta</option>
        <option value="CRITICAL">Crítica</option>
      </select>
      <input v-model="filtros.search" class="input flex-1" placeholder="Buscar ticket..." />
    </div>

    <!-- Tabla -->
    <div class="rounded-xl overflow-hidden" style="border: 1px solid var(--border)">
      <table class="w-full">
        <thead>
          <tr style="background: var(--surface2); border-bottom: 1px solid var(--border)">
            <th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase" style="color: var(--muted)">#</th>
            <th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase" style="color: var(--muted)">Título</th>
            <th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase" style="color: var(--muted)">Estado</th>
            <th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase" style="color: var(--muted)">Prioridad</th>
            <th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase" style="color: var(--muted)">Categoría</th>
            <th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase" style="color: var(--muted)">Asignado</th>
            <th class="px-4 py-3 text-left text-xs font-medium tracking-wider uppercase" style="color: var(--muted)">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in ticketsFiltrados" :key="ticket.id"
              class="cursor-pointer transition-colors duration-100"
              style="border-bottom: 1px solid var(--border); background: var(--surface)"
              @mouseenter="e => e.currentTarget.style.background = 'var(--surface2)'"
              @mouseleave="e => e.currentTarget.style.background = 'var(--surface)'"
              @click="navigateTo(`/tickets/${ticket.id}`)">
            <td class="px-4 py-3 text-xs font-mono" style="color: var(--muted)">#{{ ticket.id }}</td>
            <td class="px-4 py-3 text-sm font-medium" style="color: var(--text)">{{ ticket.title }}</td>
            <td class="px-4 py-3"><StatusBadge :status="ticket.status" /></td>
            <td class="px-4 py-3"><PriorityBadge :priority="ticket.priority" /></td>
            <td class="px-4 py-3 text-xs" style="color: var(--muted)">{{ ticket.category }}</td>
            <td class="px-4 py-3 text-xs" style="color: var(--muted)">{{ ticket.assignedTo?.name || '—' }}</td>
            <td class="px-4 py-3 text-xs font-mono" style="color: var(--muted)">{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
          </tr>
          <tr v-if="ticketsFiltrados.length === 0">
            <td colspan="7" class="px-4 py-12 text-center text-sm" style="color: var(--muted); background: var(--surface)">
              No hay tickets que mostrar
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { data: tickets } = await useFetch('/api/tickets')
const filtros = reactive({ status: '', priority: '', search: '' })

const ticketsFiltrados = computed(() =>
  (tickets.value || []).filter(t => {
    const matchStatus   = !filtros.status   || t.status   === filtros.status
    const matchPriority = !filtros.priority || t.priority === filtros.priority
    const matchSearch   = !filtros.search   || t.title.toLowerCase().includes(filtros.search.toLowerCase())
    return matchStatus && matchPriority && matchSearch
  })
)
</script>