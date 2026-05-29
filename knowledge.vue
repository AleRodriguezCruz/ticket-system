<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">Base de Conocimiento</h1>
        <p class="text-xs mt-0.5" style="color:var(--muted)">
          Soluciones documentadas de incidencias resueltas en Epicor Kinetic
        </p>
      </div>
    </div>

    <!-- Buscador -->
    <div class="card mb-5 py-3.5 px-4">
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            class="absolute" style="left:12px;top:50%;transform:translateY(-50%);color:var(--muted-2)">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="search" class="input" style="padding-left:38px"
            placeholder="Buscar en la base de conocimiento..." />
        </div>
        <select v-model="filterCategory" class="input" style="width:200px;padding-top:8px;padding-bottom:8px">
          <option value="">Todas las categorías</option>
          <option value="Configurador">Configurador (CPQ)</option>
          <option value="BAQ / Dashboard">BAQ / Dashboard</option>
          <option value="Method Directive / BPM">Method Directive / BPM</option>
          <option value="Customización">Customización</option>
          <option value="Usuarios y Permisos">Usuarios y Permisos</option>
          <option value="Sincronización / Integración">Sincronización / Integración</option>
          <option value="Materiales">Materiales</option>
          <option value="Finanzas">Finanzas</option>
          <option value="Jobs">Jobs</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="card text-center py-4">
        <p class="text-2xl font-semibold" style="color:var(--accent)">{{ closedTickets.length }}</p>
        <p class="text-xs mt-1 font-medium uppercase tracking-wider" style="color:var(--muted)">Casos documentados</p>
      </div>
      <div class="card text-center py-4">
        <p class="text-2xl font-semibold" style="color:#059669">{{ categories.length }}</p>
        <p class="text-xs mt-1 font-medium uppercase tracking-wider" style="color:var(--muted)">Categorías cubiertas</p>
      </div>
      <div class="card text-center py-4">
        <p class="text-2xl font-semibold" style="color:#7c3aed">{{ filteredTickets.length }}</p>
        <p class="text-xs mt-1 font-medium uppercase tracking-wider" style="color:var(--muted)">Resultados actuales</p>
      </div>
    </div>

    <!-- Lista de artículos -->
    <div v-if="filteredTickets.length" class="space-y-3">
      <div v-for="ticket in filteredTickets" :key="ticket.id"
        class="card transition-all cursor-pointer"
        style="transition:box-shadow 0.2s,transform 0.2s"
        onmouseover="this.style.boxShadow='var(--shadow)';this.style.transform='translateY(-1px)'"
        onmouseout="this.style.boxShadow='var(--shadow-sm)';this.style.transform='none'"
        @click="navigateTo(`/tickets/${ticket.id}`)">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="text-xs font-mono font-medium" style="color:var(--muted-2)">#{{ ticket.id }}</span>
              <span class="text-xs px-2 py-0.5 rounded-md font-medium" style="background:var(--surface3);color:var(--muted)">
                {{ ticket.category }}
              </span>
              <PriorityBadge :priority="ticket.priority" />
            </div>
            <h3 class="text-sm font-semibold mb-2" style="color:var(--text)">{{ ticket.title }}</h3>
            <div class="flex items-start gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" class="flex-shrink-0 mt-0.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              <p class="text-xs leading-relaxed line-clamp-2" style="color:var(--muted)">{{ ticket.solution }}</p>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-xs font-mono" style="color:var(--muted-2)">
              {{ new Date(ticket.closedAt || ticket.updatedAt).toLocaleDateString('es-MX') }}
            </p>
            <p class="text-xs mt-1" style="color:var(--muted-2)">{{ ticket.assignedTo?.name || ticket.createdBy?.name }}</p>
            <div class="mt-2 inline-flex items-center gap-1 text-xs font-medium" style="color:var(--accent)">
              Ver detalle
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      <p class="text-sm">No se encontraron artículos</p>
      <p class="text-xs" style="color:var(--muted-2)">
        Los tickets cerrados con solución documentada aparecerán aquí
      </p>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
</style>

<script setup>
const search         = ref('')
const filterCategory = ref('')

const { data: allTickets } = await useFetch('/api/tickets')

const closedTickets = computed(() =>
  (allTickets.value || []).filter(t => t.status === 'CLOSED' && t.solution)
)

const categories = computed(() =>
  [...new Set(closedTickets.value.map(t => t.category))]
)

const filteredTickets = computed(() =>
  closedTickets.value.filter(t => {
    const matchCat    = !filterCategory.value || t.category === filterCategory.value
    const matchSearch = !search.value || 
      t.title.toLowerCase().includes(search.value.toLowerCase()) ||
      t.solution?.toLowerCase().includes(search.value.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.value.toLowerCase())
    return matchCat && matchSearch
  })
)
</script>
