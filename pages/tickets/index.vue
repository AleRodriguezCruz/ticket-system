<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">🎫 Tickets</h1>
      <NuxtLink to="/tickets/new" class="btn-primary">+ Nuevo Ticket</NuxtLink>
    </div>

    <div class="flex gap-3 mb-6">
      <select v-model="filtros.status" class="input w-44">
        <option value="">Todos los estados</option>
        <option value="OPEN">Abierto</option>
        <option value="IN_PROGRESS">En Progreso</option>
        <option value="CLOSED">Cerrado</option>
      </select>
      <select v-model="filtros.priority" class="input w-44">
        <option value="">Todas las prioridades</option>
        <option value="LOW">Baja</option>
        <option value="MEDIUM">Media</option>
        <option value="HIGH">Alta</option>
        <option value="CRITICAL">Crítica</option>
      </select>
      <input v-model="filtros.search" class="input flex-1" placeholder="🔍 Buscar por título..." />
    </div>

    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Título</th>
            <th class="px-4 py-3 text-left">Estado</th>
            <th class="px-4 py-3 text-left">Prioridad</th>
            <th class="px-4 py-3 text-left">Categoría</th>
            <th class="px-4 py-3 text-left">Asignado a</th>
            <th class="px-4 py-3 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="ticket in ticketsFiltrados" :key="ticket.id"
              class="hover:bg-indigo-50 cursor-pointer transition-colors"
              @click="navigateTo(`/tickets/${ticket.id}`)">
            <td class="px-4 py-3 text-gray-400">#{{ ticket.id }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ ticket.title }}</td>
            <td class="px-4 py-3"><StatusBadge :status="ticket.status" /></td>
            <td class="px-4 py-3"><PriorityBadge :priority="ticket.priority" /></td>
            <td class="px-4 py-3 text-gray-600">{{ ticket.category }}</td>
            <td class="px-4 py-3 text-gray-600">{{ ticket.assignedTo?.name || '—' }}</td>
            <td class="px-4 py-3 text-gray-400">{{ new Date(ticket.createdAt).toLocaleDateString() }}</td>
          </tr>
          <tr v-if="ticketsFiltrados.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400">No hay tickets</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const { data: tickets } = await useFetch('/api/tickets')
const filtros = reactive({ status: '', priority: '', search: '' })

const ticketsFiltrados = computed(() => {
  return (tickets.value || []).filter(t => {
    const matchStatus   = !filtros.status   || t.status   === filtros.status
    const matchPriority = !filtros.priority || t.priority === filtros.priority
    const matchSearch   = !filtros.search   || t.title.toLowerCase().includes(filtros.search.toLowerCase())
    return matchStatus && matchPriority && matchSearch
  })
})
</script>