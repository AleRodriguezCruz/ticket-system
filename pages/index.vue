<template>
  <div>
<<<<<<< HEAD
    <!-- Vista ADMIN / AGENT -->
    <template v-if="auth.user?.role !== 'USER'">

      <!-- Header -->
      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-lg font-semibold tracking-tight" style="color:var(--text)">
            Buenos días, {{ firstName }} 👋
          </h1>
          <p class="text-xs mt-0.5" style="color:var(--muted)">
            {{ today }} · Epicor Kinetic Support
          </p>
        </div>
        <NuxtLink to="/tickets/new" class="btn-primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Incidencia
        </NuxtLink>
      </div>

      <!-- Stat Cards row -->
      <div class="grid grid-cols-4 gap-3 mb-5">
        <div class="stat-card green">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Abiertos</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--success-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#059669">{{ count('OPEN') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Requieren atención</p>
        </div>
        <div class="stat-card amber">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">En Progreso</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--warning-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#d97706">{{ count('IN_PROGRESS') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">En atención activa</p>
        </div>
        <div class="stat-card slate">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Cerrados</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background:#f3f4f6">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#64748b">{{ count('CLOSED') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Resueltos total</p>
        </div>
        <div class="stat-card blue">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Base Conocim.</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style="background:var(--accent-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#1a56db">{{ count('CLOSED') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Artículos disponibles</p>
        </div>
      </div>

      <!-- Charts: 3 columnas bien proporcionadas -->
      <div class="grid gap-3 mb-3" style="grid-template-columns:1fr 1.6fr 1fr">
        <!-- Dona estado -->
        <div class="card" style="padding:16px 18px">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--muted)">Por Estado</p>
          <div style="height:160px;display:flex;align-items:center;justify-content:center">
            <Doughnut v-if="stats" :data="statusChart" :options="doughnutOpts" />
          </div>
          <!-- mini legend -->
          <div class="flex flex-col gap-1 mt-3">
            <div v-for="(item,i) in statusItems" :key="i" class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full flex-shrink-0" :style="`background:${item.color}`"></div>
                <span class="text-xs" style="color:var(--muted)">{{ item.label }}</span>
              </div>
              <span class="text-xs font-semibold" style="color:var(--text)">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Barras mensuales -->
        <div class="card" style="padding:16px 18px">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Incidencias por Mes</p>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium" style="background:var(--accent-soft);color:var(--accent)">Últimos 6 meses</span>
          </div>
          <div style="height:200px">
            <Bar v-if="stats" :data="monthlyChart" :options="barOpts" />
          </div>
        </div>

        <!-- Dona prioridad -->
        <div class="card" style="padding:16px 18px">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--muted)">Por Prioridad</p>
          <div style="height:160px;display:flex;align-items:center;justify-content:center">
            <Doughnut v-if="stats" :data="priorityChart" :options="doughnutOpts" />
          </div>
          <div class="flex flex-col gap-1 mt-3">
            <div v-for="(item,i) in priorityItems" :key="i" class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 rounded-full flex-shrink-0" :style="`background:${item.color}`"></div>
                <span class="text-xs" style="color:var(--muted)">{{ item.label }}</span>
              </div>
              <span class="text-xs font-semibold" style="color:var(--text)">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fila inferior: barras categoría + últimos tickets -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Barras categoría horizontal -->
        <div class="card" style="padding:16px 18px">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--muted)">Top Categorías</p>
          <div style="height:180px">
            <Bar v-if="stats" :data="categoryChart" :options="{ ...barOpts, indexAxis: 'y', plugins: { legend: { display: false } } }" />
          </div>
        </div>

        <!-- Tickets recientes mini-lista -->
        <div class="card" style="padding:16px 18px">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Recientes</p>
            <NuxtLink to="/tickets" class="text-xs font-medium" style="color:var(--accent)">Ver todos →</NuxtLink>
          </div>
          <div class="space-y-2">
            <div v-for="ticket in recentTickets" :key="ticket.id"
              class="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
              style="background:var(--surface2)"
              onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background='var(--surface2)'"
              @click="navigateTo(`/tickets/${ticket.id}`)">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium truncate" style="color:var(--text)">{{ ticket.title }}</p>
                <p class="text-xs truncate mt-0.5" style="color:var(--muted-2)">{{ ticket.category }}</p>
              </div>
              <StatusBadge :status="ticket.status" />
            </div>
            <div v-if="!recentTickets.length" class="text-center py-6" style="color:var(--muted-2)">
              <p class="text-xs">Sin incidencias recientes</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ════════════════════════════ Vista USER ════════════════════════════ -->
    <template v-else>
      <!-- Header usuario -->
      <div class="mb-6">
        <h1 class="text-lg font-semibold tracking-tight" style="color:var(--text)">
          Hola, {{ firstName }} 👋
        </h1>
        <p class="text-xs mt-0.5" style="color:var(--muted)">
          Consulta el estado de tus incidencias o reporta una nueva
        </p>
      </div>

      <!-- Mis tickets resumen -->
      <div class="grid grid-cols-3 gap-3 mb-5">
        <div class="stat-card green">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--muted)">Mis Abiertos</p>
          <p class="text-2xl font-semibold" style="color:#059669">{{ myCount('OPEN') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Pendientes</p>
        </div>
        <div class="stat-card amber">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--muted)">En Progreso</p>
          <p class="text-2xl font-semibold" style="color:#d97706">{{ myCount('IN_PROGRESS') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Siendo atendidos</p>
        </div>
        <div class="stat-card slate">
          <p class="text-xs font-semibold uppercase tracking-wider mb-2" style="color:var(--muted)">Cerrados</p>
          <p class="text-2xl font-semibold" style="color:#64748b">{{ myCount('CLOSED') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Resueltos</p>
        </div>
      </div>

      <!-- CTA crear ticket -->
      <div class="card mb-5" style="background:linear-gradient(135deg,#eff6ff,#f0fdf4);border-color:#bfdbfe">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
            <div>
              <p class="text-sm font-semibold" style="color:#0f1923">¿Tienes un problema con Epicor?</p>
              <p class="text-xs mt-0.5" style="color:#4b5563">Reporta tu incidencia y el equipo de soporte la atenderá</p>
            </div>
          </div>
          <NuxtLink to="/tickets/new" class="btn-primary flex-shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nueva Incidencia
          </NuxtLink>
        </div>
      </div>

      <!-- Mis últimos tickets -->
      <div class="card">
        <div class="flex items-center justify-between mb-4 pb-3" style="border-bottom:1px solid var(--border-soft)">
          <p class="text-sm font-semibold" style="color:var(--text)">Mis incidencias recientes</p>
          <NuxtLink to="/tickets" class="text-xs font-medium" style="color:var(--accent)">Ver todas →</NuxtLink>
        </div>
        <div class="space-y-2">
          <div v-for="ticket in myRecentTickets" :key="ticket.id"
            class="flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors"
            style="background:var(--surface2)"
            onmouseover="this.style.background='var(--surface3)'" onmouseout="this.style.background='var(--surface2)'"
            @click="navigateTo(`/tickets/${ticket.id}`)">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-mono font-medium" style="color:var(--muted-2)">#{{ ticket.id }}</span>
                <span class="text-xs px-1.5 py-0.5 rounded font-medium" style="background:var(--surface3);color:var(--muted)">{{ ticket.category }}</span>
              </div>
              <p class="text-sm font-medium" style="color:var(--text)">{{ ticket.title }}</p>
              <p class="text-xs mt-0.5" style="color:var(--muted-2)">
                {{ new Date(ticket.createdAt).toLocaleDateString('es-MX', { day:'numeric', month:'short', year:'numeric' }) }}
                <span v-if="ticket.assignedTo" class="ml-2">· Asignado a {{ ticket.assignedTo.name }}</span>
              </p>
            </div>
            <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
              <StatusBadge :status="ticket.status" />
              <PriorityBadge :priority="ticket.priority" />
            </div>
          </div>
          <div v-if="!myRecentTickets.length" class="empty-state py-10">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            <p>No tienes incidencias aún</p>
            <p class="text-xs" style="color:var(--muted-2)">Crea tu primera incidencia con el botón de arriba</p>
          </div>
        </div>
      </div>
    </template>
=======
    <!-- Header -->
    <div class="mb-7">
      <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">Dashboard</h1>
      <p class="text-xs mt-1" style="color:var(--muted)">Resumen general · Epicor Kinetic Support</p>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-4 gap-4 mb-7">
      <div class="stat-card green">
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Abiertos</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:var(--success-soft)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </div>
        </div>
        <p class="text-3xl font-semibold tracking-tight" style="color:#059669">{{ count('OPEN') }}</p>
        <p class="text-xs mt-1" style="color:var(--muted-2)">Requieren atención</p>
      </div>

      <div class="stat-card amber">
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">En Progreso</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:var(--warning-soft)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><path d="M12 22V12"/><path d="M12 8V2"/><path d="M4.93 4.93l4.24 4.24"/><path d="M14.83 14.83l4.24 4.24"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l4.24-4.24"/><path d="M14.83 9.17l4.24-4.24"/></svg>
          </div>
        </div>
        <p class="text-3xl font-semibold tracking-tight" style="color:#d97706">{{ count('IN_PROGRESS') }}</p>
        <p class="text-xs mt-1" style="color:var(--muted-2)">En atención activa</p>
      </div>

      <div class="stat-card slate">
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Cerrados</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:#f3f4f6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
          </div>
        </div>
        <p class="text-3xl font-semibold tracking-tight" style="color:#64748b">{{ count('CLOSED') }}</p>
        <p class="text-xs mt-1" style="color:var(--muted-2)">Resueltos</p>
      </div>

      <div class="stat-card blue">
        <div class="flex items-start justify-between mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Total</p>
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:var(--accent-soft)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </div>
        </div>
        <p class="text-3xl font-semibold tracking-tight" style="color:#1a56db">{{ total }}</p>
        <p class="text-xs mt-1" style="color:var(--muted-2)">Incidencias registradas</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="card">
        <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Por Estado</p>
        <Doughnut v-if="stats" :data="statusChart" :options="doughnutOpts" />
      </div>
      <div class="card">
        <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Incidencias por Mes</p>
        <Bar v-if="stats" :data="monthlyChart" :options="barOpts" />
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="card">
        <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Categorías con más Incidencias</p>
        <Bar v-if="stats" :data="categoryChart" :options="{ ...barOpts, indexAxis: 'y' }" />
      </div>
      <div class="card">
        <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Por Prioridad</p>
        <Doughnut v-if="stats" :data="priorityChart" :options="doughnutOpts" />
      </div>
    </div>
>>>>>>> cedc22be237c444deec09833a66085a6f0ecb67d
  </div>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
<<<<<<< HEAD
import { useAuthStore } from '~/stores/auth'
Chart.register(...registerables)

const auth = useAuthStore()
const { data: stats }   = await useFetch('/api/stats')
const { data: tickets } = await useFetch('/api/tickets')

const today = new Date().toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' })
const firstName = computed(() => auth.user?.name?.split(' ')[0] || '')

// Admin/Agent stats
const count = (status) => stats.value?.byStatus.find(s => s.label === status)?.count || 0

// User personal stats
const myTickets = computed(() => (tickets.value || []).filter(t => t.createdById === auth.user?.id))
const myCount = (status) => myTickets.value.filter(t => t.status === status).length
const myRecentTickets = computed(() => myTickets.value.slice(0, 6))
const recentTickets   = computed(() => (tickets.value || []).slice(0, 6))

// Chart config - compact
const compact = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y ?? ctx.parsed} tickets` } }
  }
}
const doughnutOpts = {
  ...compact,
  cutout: '72%',
  plugins: { ...compact.plugins, legend: { display: false } }
}
const barOpts = {
  ...compact,
  scales: {
    x: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { display: false }, border: { display: false } },
    y: { ticks: { color: '#9ca3af', font: { size: 10 } }, grid: { color: '#f0f2f6' }, border: { display: false } }
  }
}

const statusItems = computed(() => [
  { label: 'Abierto',      color: '#059669', value: count('OPEN')        },
  { label: 'En Progreso',  color: '#d97706', value: count('IN_PROGRESS') },
  { label: 'Cerrado',      color: '#94a3b8', value: count('CLOSED')      },
])
const priorityItems = computed(() => [
  { label: 'Baja',     color: '#60a5fa', value: stats.value?.byPriority.find(p=>p.label==='LOW')?.count     || 0 },
  { label: 'Media',    color: '#34d399', value: stats.value?.byPriority.find(p=>p.label==='MEDIUM')?.count  || 0 },
  { label: 'Alta',     color: '#f59e0b', value: stats.value?.byPriority.find(p=>p.label==='HIGH')?.count    || 0 },
  { label: 'Crítica',  color: '#ef4444', value: stats.value?.byPriority.find(p=>p.label==='CRITICAL')?.count|| 0 },
])

const statusChart = computed(() => ({
  labels: ['Abierto', 'En Progreso', 'Cerrado'],
  datasets: [{ data: [count('OPEN'), count('IN_PROGRESS'), count('CLOSED')],
    backgroundColor: ['#059669', '#d97706', '#94a3b8'], borderWidth: 0, hoverOffset: 3 }]
}))
const monthlyChart = computed(() => ({
  labels: stats.value?.monthly.map(m => m.month.slice(5)).reverse() || [],
  datasets: [{ label:'Tickets', data: stats.value?.monthly.map(m => m.count).reverse() || [],
    backgroundColor: '#1a56db', borderRadius: 5, borderSkipped: false }]
}))
const categoryChart = computed(() => ({
  labels: stats.value?.byCategory.slice(0,5).map(c => c.label) || [],
  datasets: [{ label:'Tickets', data: stats.value?.byCategory.slice(0,5).map(c => c.count) || [],
    backgroundColor: '#7c3aed', borderRadius: 4, borderSkipped: false }]
}))
const priorityChart = computed(() => ({
  labels: ['Baja', 'Media', 'Alta', 'Crítica'],
  datasets: [{ data: priorityItems.value.map(p=>p.value),
    backgroundColor: ['#60a5fa','#34d399','#f59e0b','#ef4444'], borderWidth: 0, hoverOffset: 3 }]
=======
Chart.register(...registerables)

const { data: stats } = await useFetch('/api/stats')

const baseOpts = {
  responsive: true,
  plugins: {
    legend: { labels: { color: '#6b7280', font: { size: 11, family: 'DM Sans' }, boxWidth: 10, padding: 16 } }
  }
}
const barOpts = {
  ...baseOpts,
  scales: {
    x: { ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { color: '#f0f2f6', lineWidth: 1 }, border: { display: false } },
    y: { ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { color: '#f0f2f6', lineWidth: 1 }, border: { display: false } }
  }
}
const doughnutOpts = { ...baseOpts, cutout: '68%' }

const count = (status) => stats.value?.byStatus.find(s => s.label === status)?.count || 0
const total = computed(() => stats.value?.byStatus.reduce((a, b) => a + b.count, 0) || 0)

const statusChart = computed(() => ({
  labels: ['Abierto', 'En Progreso', 'Cerrado'],
  datasets: [{ data: stats.value?.byStatus.map(s => s.count), backgroundColor: ['#059669', '#d97706', '#94a3b8'], borderWidth: 0, hoverOffset: 4 }]
}))
const monthlyChart = computed(() => ({
  labels: stats.value?.monthly.map(m => m.month).reverse(),
  datasets: [{ label: 'Tickets', data: stats.value?.monthly.map(m => m.count).reverse(), backgroundColor: '#1a56db', borderRadius: 5, borderSkipped: false }]
}))
const categoryChart = computed(() => ({
  labels: stats.value?.byCategory.map(c => c.label),
  datasets: [{ label: 'Tickets', data: stats.value?.byCategory.map(c => c.count), backgroundColor: '#7c3aed', borderRadius: 5, borderSkipped: false }]
}))
const priorityChart = computed(() => ({
  labels: ['Baja', 'Media', 'Alta', 'Crítica'],
  datasets: [{ data: stats.value?.byPriority.map(p => p.count), backgroundColor: ['#60a5fa', '#34d399', '#f59e0b', '#ef4444'], borderWidth: 0, hoverOffset: 4 }]
>>>>>>> cedc22be237c444deec09833a66085a6f0ecb67d
}))
</script>
