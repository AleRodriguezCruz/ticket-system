<template>
  <div>
    <!-- ADMIN / AGENT VIEW -->
    <template v-if="isAdminOrAgent">

      <div class="flex items-start justify-between mb-6">
        <div>
          <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">
            Buenos días, {{ firstName }} 👋
          </h1>
          <p class="text-xs mt-1" style="color:var(--muted)">
            Aquí está el resumen del sistema al día de hoy
          </p>
        </div>
        <NuxtLink to="/tickets/new" class="btn-primary">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Incidencia
        </NuxtLink>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-4 gap-3 mb-5">
        <div class="stat-card green" v-for="s in stats" :key="s.label">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">{{ s.label }}</span>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" :style="`background:${s.bg}`">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" :stroke="s.color" stroke-width="2.5" v-html="s.icon"></svg>
            </div>
          </div>
          <div class="text-3xl font-bold mb-0.5" :style="`color:${s.color}`">{{ s.value }}</div>
          <div class="text-xs" style="color:var(--muted-2)">{{ s.sub }}</div>
        </div>
      </div>

      <!-- Charts row -->
      <div class="grid grid-cols-5 gap-4 mb-4">

        <!-- Estado donut -->
        <div class="card col-span-2">
          <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Por Estado</p>
          <div class="flex items-center gap-5">
            <svg width="100" height="100" viewBox="0 0 100 100" class="flex-shrink-0">
              <circle cx="50" cy="50" r="36" fill="none" stroke="var(--surface3)" stroke-width="14"/>
              <circle cx="50" cy="50" r="36" fill="none" stroke="#059669" stroke-width="14"
                :stroke-dasharray="`${openPct * 2.262} ${226.2}`"
                stroke-dashoffset="56.5" stroke-linecap="butt"/>
              <circle cx="50" cy="50" r="36" fill="none" stroke="#d97706" stroke-width="14"
                :stroke-dasharray="`${inPct * 2.262} ${226.2}`"
                :stroke-dashoffset="`${56.5 - openPct * 2.262}`" stroke-linecap="butt"/>
              <text x="50" y="46" text-anchor="middle" font-size="17" font-weight="700" fill="var(--text)">{{ total }}</text>
              <text x="50" y="58" text-anchor="middle" font-size="8" fill="var(--muted-2)">total</text>
            </svg>
            <div class="space-y-2.5 flex-1">
              <div v-for="s in statusLegend" :key="s.label" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full flex-shrink-0" :style="`background:${s.color}`"></div>
                  <span class="text-xs" style="color:var(--muted)">{{ s.label }}</span>
                </div>
                <span class="text-xs font-semibold" style="color:var(--text)">{{ s.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Categorías bar chart -->
        <div class="card col-span-3">
          <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Incidencias por Categoría</p>
          <div class="space-y-2.5">
            <div v-for="c in topCategories" :key="c.name">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs truncate" style="color:var(--text-2);max-width:200px">{{ c.name }}</span>
                <span class="text-xs font-semibold ml-3 flex-shrink-0" style="color:var(--text)">{{ c.count }}</span>
              </div>
              <div class="h-1.5 rounded-full" style="background:var(--surface3)">
                <div class="h-full rounded-full transition-all duration-700"
                  style="background:linear-gradient(90deg,#1a56db,#60a5fa)"
                  :style="{ width: `${Math.max((c.count / maxCat) * 100, 4)}%` }"></div>
              </div>
            </div>
            <div v-if="!topCategories.length" class="text-xs text-center py-4" style="color:var(--muted-2)">
              Sin datos aún
            </div>
          </div>
        </div>
      </div>

      <!-- Prioridades + Tabla recientes -->
      <div class="grid grid-cols-5 gap-4">

        <!-- Prioridades -->
        <div class="card col-span-2">
          <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Por Prioridad</p>
          <div class="space-y-3">
            <div v-for="p in priorityStats" :key="p.key">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="badge text-xs" :style="p.badgeStyle">{{ p.label }}</span>
                </div>
                <span class="text-xs font-semibold" style="color:var(--text)">{{ p.count }}</span>
              </div>
              <div class="h-1.5 rounded-full" style="background:var(--surface3)">
                <div class="h-full rounded-full"
                  :style="{ width: `${total ? Math.max((p.count/total)*100,p.count?4:0) : 0}%`, background: p.color }">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recientes -->
        <div class="card-flush col-span-3">
          <div class="flex items-center justify-between px-4 py-3" style="border-bottom:1px solid var(--border-soft)">
            <p class="text-sm font-semibold" style="color:var(--text)">Recientes</p>
            <NuxtLink to="/tickets" class="text-xs font-medium" style="color:var(--accent)">Ver todos →</NuxtLink>
          </div>
          <div>
            <div v-for="t in recentTickets" :key="t.id"
              class="flex items-center gap-3 px-4 py-3 table-row clickable"
              @click="navigateTo(`/tickets/${t.id}`)">
              <span class="text-xs font-mono flex-shrink-0" style="color:var(--muted-2);width:32px">#{{ t.id }}</span>
              <span class="text-sm flex-1 truncate font-medium" style="color:var(--text)">{{ t.title }}</span>
              <StatusBadge :status="t.status" />
              <PriorityBadge :priority="t.priority" />
            </div>
            <div v-if="!recentTickets.length" class="empty-state py-8">
              <p style="color:var(--muted-2)">Sin incidencias aún</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- USER VIEW -->
    <template v-else>
      <div class="mb-6">
        <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">Hola, {{ firstName }} 👋</h1>
        <p class="text-xs mt-1" style="color:var(--muted)">Estas son tus incidencias activas</p>
      </div>

      <div class="grid grid-cols-3 gap-3 mb-5">
        <div class="stat-card green">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--muted)">Abiertas</p>
          <p class="text-3xl font-bold" style="color:#059669">{{ myCount('OPEN') }}</p>
        </div>
        <div class="stat-card amber">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--muted)">En Progreso</p>
          <p class="text-3xl font-bold" style="color:#d97706">{{ myCount('IN_PROGRESS') }}</p>
        </div>
        <div class="stat-card slate">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--muted)">Resueltas</p>
          <p class="text-3xl font-bold" style="color:#475569">{{ myCount('CLOSED') }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between mb-4">
        <p class="text-sm font-semibold" style="color:var(--text)">Mis Incidencias</p>
        <NuxtLink to="/tickets/new" class="btn-primary text-xs" style="padding:6px 12px">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Reportar
        </NuxtLink>
      </div>

      <div class="table-container">
        <table class="w-full">
          <thead>
            <tr style="background:var(--surface2);border-bottom:1px solid var(--border-soft)">
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">#</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Título</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Estado</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Prioridad</th>
              <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in myTickets" :key="t.id" class="table-row clickable" @click="navigateTo(`/tickets/${t.id}`)">
              <td class="px-4 py-3 text-xs mono" style="color:var(--muted-2)">#{{ t.id }}</td>
              <td class="px-4 py-3 text-sm font-medium" style="color:var(--text)">{{ t.title }}</td>
              <td class="px-4 py-3"><StatusBadge :status="t.status" /></td>
              <td class="px-4 py-3"><PriorityBadge :priority="t.priority" /></td>
              <td class="px-4 py-3 text-xs mono" style="color:var(--muted-2)">
                {{ new Date(t.createdAt).toLocaleDateString('es-MX') }}
              </td>
            </tr>
            <tr v-if="!myTickets.length">
              <td colspan="5">
                <div class="empty-state">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                  <p>No tienes incidencias reportadas</p>
                  <NuxtLink to="/tickets/new" class="btn-primary text-xs" style="margin-top:4px;padding:6px 12px">
                    Reportar primera incidencia
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({ ssr: false })

const auth    = useAuthStore()
const tickets = ref([])
const loading = ref(true)

onMounted(async () => {
  if (!auth.isLoggedIn) { navigateTo('/login'); return }
  try {
    tickets.value = await $fetch('/api/tickets', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  } catch (e) {
    console.error('Error cargando tickets:', e)
  } finally {
    loading.value = false
  }
})

const isAdminOrAgent = computed(() => ['ADMIN','AGENT'].includes(auth.user?.role))
const firstName      = computed(() => auth.user?.name?.split(' ')[0] || 'Usuario')
const total          = computed(() => tickets.value?.length || 0)

const countS    = s => tickets.value?.filter(t => t.status === s).length ?? 0
const countP    = p => tickets.value?.filter(t => t.priority === p).length ?? 0
const myTickets = computed(() => tickets.value?.filter(t => t.createdById === auth.user?.id) ?? [])
const myCount   = s => myTickets.value.filter(t => t.status === s).length

const openPct = computed(() => total.value ? (countS('OPEN') / total.value) * 100 : 0)
const inPct   = computed(() => total.value ? (countS('IN_PROGRESS') / total.value) * 100 : 0)
const recentTickets = computed(() =>
  [...(tickets.value ?? [])].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6)
)

const stats = computed(() => [
  { label:'Abiertos',    value: countS('OPEN'),        sub:'Requieren atención', color:'#059669', bg:'rgba(5,150,105,0.08)',  icon:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
  { label:'En Progreso', value: countS('IN_PROGRESS'), sub:'Siendo atendidos',   color:'#d97706', bg:'rgba(217,119,6,0.08)',  icon:'<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>' },
  { label:'Cerrados',    value: countS('CLOSED'),       sub:'Resueltos',          color:'#475569', bg:'rgba(71,85,105,0.08)', icon:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>' },
  { label:'Total',       value: total.value,            sub:'En el sistema',      color:'#1a56db', bg:'rgba(26,86,219,0.08)', icon:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
])

const statusLegend = computed(() => [
  { label:'Abiertos',    value: countS('OPEN'),        color:'#059669' },
  { label:'En Progreso', value: countS('IN_PROGRESS'), color:'#d97706' },
  { label:'Cerrados',    value: countS('CLOSED'),       color:'#94a3b8' },
])

const topCategories = computed(() => {
  const m = {}
  tickets.value?.forEach(t => { m[t.category] = (m[t.category]||0)+1 })
  return Object.entries(m).map(([name,count]) => ({name,count}))
    .sort((a,b)=>b.count-a.count).slice(0,6)
})
const maxCat = computed(() => topCategories.value[0]?.count || 1)

const priorityStats = computed(() => [
  { key:'CRITICAL', label:'Crítica', color:'#dc2626', count: countP('CRITICAL'), badgeStyle:'background:#fef2f2;color:#b91c1c;border:1px solid #fecaca' },
  { key:'HIGH',     label:'Alta',    color:'#f97316', count: countP('HIGH'),     badgeStyle:'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa' },
  { key:'MEDIUM',   label:'Media',   color:'#eab308', count: countP('MEDIUM'),   badgeStyle:'background:#fefce8;color:#854d0e;border:1px solid #fde68a' },
  { key:'LOW',      label:'Baja',    color:'#3b82f6', count: countP('LOW'),      badgeStyle:'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe' },
])
</script>
