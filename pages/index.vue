<template>
  <div>

    <!-- ═══════════════════════════════════════
         ADMIN / AGENT
    ═══════════════════════════════════════ -->
    <template v-if="isAdminOrAgent">

      <div class="flex items-center justify-between mb-5">
        <div>
          <h1 class="text-lg font-semibold" style="color:var(--text)">
            Hola, {{ firstName }} 👋
          </h1>
          <p class="text-xs mt-0.5" style="color:var(--muted)">
            {{ today }} · Panel de administración
          </p>
        </div>
        <NuxtLink to="/tickets/new" class="btn-primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Incidencia
        </NuxtLink>
      </div>

      <!-- 4 stat cards -->
      <div class="grid grid-cols-4 gap-3 mb-4">

        <div class="stat-card green">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Abiertos</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:var(--success-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#059669">{{ count('OPEN') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Requieren atención</p>
        </div>

        <div class="stat-card amber">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">En Progreso</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:var(--warning-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#d97706">{{ count('IN_PROGRESS') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Siendo atendidos</p>
        </div>

        <div class="stat-card slate">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Cerrados</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#f3f4f6">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#64748b">{{ count('CLOSED') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Resueltos total</p>
        </div>

        <div class="stat-card blue">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Base Conocim.</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:var(--accent-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#1a56db">{{ knowledgeCount }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Artículos documentados</p>
        </div>

      </div>

      <!-- Fila 1: dona estado | barras mes | dona prioridad -->
      <div class="grid gap-3 mb-3" style="grid-template-columns:188px 1fr 188px">

        <!-- Dona estado -->
        <div class="card" style="padding:14px 16px">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--muted)">Por Estado</p>
          <div style="position:relative;width:100%;height:130px">
            <Doughnut v-if="stats" :data="statusChart" :options="doughnutOpts" />
          </div>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:5px">
            <div v-for="item in statusLegend" :key="item.label" style="display:flex;align-items:center;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:5px">
                <div style="width:6px;height:6px;border-radius:50%;flex-shrink:0" :style="`background:${item.color}`"></div>
                <span style="font-size:11px;color:var(--muted)">{{ item.label }}</span>
              </div>
              <span style="font-size:11px;font-weight:600;color:var(--text)">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Barras mensuales -->
        <div class="card" style="padding:14px 16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Incidencias por Mes</p>
            <span style="font-size:10.5px;background:var(--accent-soft);color:var(--accent);padding:2px 8px;border-radius:10px;font-weight:500">Últimos 6 meses</span>
          </div>
          <div style="position:relative;width:100%;height:176px">
            <Bar v-if="stats" :data="monthlyChart" :options="barOpts" />
          </div>
        </div>

        <!-- Dona prioridad -->
        <div class="card" style="padding:14px 16px">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--muted)">Por Prioridad</p>
          <div style="position:relative;width:100%;height:130px">
            <Doughnut v-if="stats" :data="priorityChart" :options="doughnutOpts" />
          </div>
          <div style="margin-top:10px;display:flex;flex-direction:column;gap:5px">
            <div v-for="item in priorityLegend" :key="item.label" style="display:flex;align-items:center;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:5px">
                <div style="width:6px;height:6px;border-radius:50%;flex-shrink:0" :style="`background:${item.color}`"></div>
                <span style="font-size:11px;color:var(--muted)">{{ item.label }}</span>
              </div>
              <span style="font-size:11px;font-weight:600;color:var(--text)">{{ item.value }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Fila 2: categorías | recientes -->
      <div class="grid grid-cols-2 gap-3">

        <div class="card" style="padding:14px 16px">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--muted)">Top Categorías</p>
          <div style="position:relative;width:100%;height:168px">
            <Bar v-if="stats" :data="categoryChart" :options="categoryOpts" />
          </div>
        </div>

        <div class="card" style="padding:14px 16px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Recientes</p>
            <NuxtLink to="/tickets" style="font-size:11px;font-weight:500;color:var(--accent)">Ver todos →</NuxtLink>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div
              v-for="t in recentTickets" :key="t.id"
              style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:6px;background:var(--surface2);cursor:pointer"
              onmouseover="this.style.background='var(--surface3)'"
              onmouseout="this.style.background='var(--surface2)'"
              @click="navigateTo(`/tickets/${t.id}`)">
              <div style="flex:1;min-width:0">
                <p style="font-size:11.5px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ t.title }}</p>
                <p style="font-size:10.5px;color:var(--muted-2);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ t.category }}</p>
              </div>
              <StatusBadge :status="t.status" />
            </div>
            <div v-if="!recentTickets.length" style="text-align:center;padding:16px;color:var(--muted-2);font-size:12px">
              Sin incidencias aún
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- ═══════════════════════════════════════
         USUARIO
    ═══════════════════════════════════════ -->
    <template v-else>

      <div style="margin-bottom:20px">
        <h1 class="text-lg font-semibold" style="color:var(--text)">Hola, {{ firstName }} 👋</h1>
        <p class="text-xs mt-0.5" style="color:var(--muted)">Consulta el estado de tus incidencias o reporta una nueva</p>
      </div>

      <!-- 3 stat cards personales -->
      <div class="grid grid-cols-3 gap-3 mb-4">

        <div class="stat-card green">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Mis Abiertos</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:var(--success-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#059669">{{ myCount('OPEN') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Pendientes</p>
        </div>

        <div class="stat-card amber">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">En Progreso</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:var(--warning-soft)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.5"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#d97706">{{ myCount('IN_PROGRESS') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Siendo atendidos</p>
        </div>

        <div class="stat-card slate">
          <div class="flex items-start justify-between mb-2">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Cerrados</p>
            <div class="w-7 h-7 rounded-lg flex items-center justify-center" style="background:#f3f4f6">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
            </div>
          </div>
          <p class="text-2xl font-semibold" style="color:#64748b">{{ myCount('CLOSED') }}</p>
          <p class="text-xs mt-0.5" style="color:var(--muted-2)">Resueltos</p>
        </div>

      </div>

      <!-- CTA -->
      <div class="card mb-4" style="background:linear-gradient(135deg,#eff6ff 0%,#f0fdf4 100%);border-color:#bfdbfe;padding:16px 20px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:40px;height:40px;border-radius:10px;background:#1a56db;display:flex;align-items:center;justify-content:center;flex-shrink:0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            </div>
            <div>
              <p style="font-size:13px;font-weight:600;color:#0f1923">¿Problema con Epicor Kinetic?</p>
              <p style="font-size:11.5px;color:#4b5563;margin-top:2px">El equipo de soporte atenderá tu incidencia a la brevedad</p>
            </div>
          </div>
          <NuxtLink to="/tickets/new" class="btn-primary" style="flex-shrink:0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva Incidencia
          </NuxtLink>
        </div>
      </div>

      <!-- Mis tickets -->
      <div class="card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border-soft)">
          <p class="text-sm font-semibold" style="color:var(--text)">Mis incidencias</p>
          <NuxtLink to="/tickets" style="font-size:11px;font-weight:500;color:var(--accent)">Ver todas →</NuxtLink>
        </div>

        <div style="display:flex;flex-direction:column;gap:6px">
          <div
            v-for="t in myRecentTickets" :key="t.id"
            style="display:flex;align-items:flex-start;gap:10px;padding:9px 10px;border-radius:6px;background:var(--surface2);cursor:pointer"
            onmouseover="this.style.background='var(--surface3)'"
            onmouseout="this.style.background='var(--surface2)'"
            @click="navigateTo(`/tickets/${t.id}`)">
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
                <span style="font-size:10.5px;font-family:monospace;color:var(--muted-2)">#{{ t.id }}</span>
                <span style="font-size:10.5px;padding:1px 6px;border-radius:4px;background:var(--surface3);color:var(--muted)">{{ t.category }}</span>
              </div>
              <p style="font-size:12.5px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ t.title }}</p>
              <p style="font-size:10.5px;color:var(--muted-2);margin-top:2px">
                {{ formatDate(t.createdAt) }}
                <span v-if="t.assignedTo"> · {{ t.assignedTo.name }}</span>
              </p>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
              <StatusBadge :status="t.status" />
              <PriorityBadge :priority="t.priority" />
            </div>
          </div>

          <div v-if="!myRecentTickets.length" class="empty-state" style="padding:32px 0">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
            <p>Sin incidencias aún</p>
            <p class="text-xs" style="color:var(--muted-2)">Usa el botón de arriba para reportar tu primer problema</p>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

Chart.register(...registerables)

const authStore = useAuthStore()
const { token, user } = storeToRefs(authStore)

// ⭐ Esperar a que la sesión esté cargada
await authStore.loadFromStorage()

// ⭐ Función helper para hacer fetch con autenticación
const fetchWithAuth = async (url) => {
  return $fetch(url, {
    headers: {
      'Authorization': `Bearer ${token.value}`
    }
  })
}

// ⭐ Fetch data con el token
const { data: stats } = await useAsyncData('stats', () => fetchWithAuth('/api/stats'))
const { data: tickets } = await useAsyncData('tickets', () => fetchWithAuth('/api/tickets'))
const { data: knowledge } = await useAsyncData('knowledge', () => fetchWithAuth('/api/knowledge'))

const isAdminOrAgent = computed(() => user.value?.role !== 'USER')
const firstName = computed(() => user.value?.name?.split(' ')[0] || '')
const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Admin ──────────────────────────────────────────────
const count = (s) => stats.value?.byStatus?.find(x => x.label === s)?.count || 0
const knowledgeCount = computed(() => knowledge.value?.length || 0)
const recentTickets = computed(() => (tickets.value || []).slice(0, 6))

// ── Usuario ────────────────────────────────────────────
const myTickets = computed(() => (tickets.value || []).filter(t => t.createdById === user.value?.id))
const myCount = (s) => myTickets.value.filter(t => t.status === s).length
const myRecentTickets = computed(() => myTickets.value.slice(0, 8))

// ── Leyendas ───────────────────────────────────────────
const statusLegend = computed(() => [
  { label: 'Abierto', color: '#059669', value: count('OPEN') },
  { label: 'En Progreso', color: '#d97706', value: count('IN_PROGRESS') },
  { label: 'Cerrado', color: '#94a3b8', value: count('CLOSED') },
])

const priorityLegend = computed(() => [
  { label: 'Baja', color: '#60a5fa', value: stats.value?.byPriority?.find(p => p.label === 'LOW')?.count || 0 },
  { label: 'Media', color: '#34d399', value: stats.value?.byPriority?.find(p => p.label === 'MEDIUM')?.count || 0 },
  { label: 'Alta', color: '#f59e0b', value: stats.value?.byPriority?.find(p => p.label === 'HIGH')?.count || 0 },
  { label: 'Crítica', color: '#ef4444', value: stats.value?.byPriority?.find(p => p.label === 'CRITICAL')?.count || 0 },
])

// ── Chart options ──────────────────────────────────────
const doughnutOpts = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '74%',
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: ctx => ` ${ctx.parsed} tickets` } }
  }
}

const barBase = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} tickets` } }
  },
  scales: {
    x: {
      ticks: { color: '#9ca3af', font: { size: 10 }, maxRotation: 0 },
      grid: { display: false },
      border: { display: false }
    },
    y: {
      ticks: { color: '#9ca3af', font: { size: 10 }, precision: 0 },
      grid: { color: '#f0f2f6', lineWidth: 1 },
      border: { display: false }
    }
  }
}

const barOpts = { ...barBase }

const categoryOpts = {
  ...barBase,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: {
      ticks: { color: '#9ca3af', font: { size: 10 }, precision: 0 },
      grid: { color: '#f0f2f6', lineWidth: 1 },
      border: { display: false }
    },
    y: {
      ticks: { color: '#9ca3af', font: { size: 10 } },
      grid: { display: false },
      border: { display: false }
    }
  }
}

// ── Chart data ─────────────────────────────────────────
const statusChart = computed(() => ({
  labels: ['Abierto', 'En Progreso', 'Cerrado'],
  datasets: [{
    data: [count('OPEN'), count('IN_PROGRESS'), count('CLOSED')],
    backgroundColor: ['#059669', '#d97706', '#94a3b8'],
    borderWidth: 0,
    hoverOffset: 3
  }]
}))

const monthlyChart = computed(() => ({
  labels: (stats.value?.monthly || []).map(m => m.month?.slice(5)).reverse(),
  datasets: [{
    data: (stats.value?.monthly || []).map(m => m.count).reverse(),
    backgroundColor: '#1a56db',
    borderRadius: 5,
    borderSkipped: false
  }]
}))

const categoryChart = computed(() => ({
  labels: (stats.value?.byCategory || []).slice(0, 5).map(c => c.label),
  datasets: [{
    data: (stats.value?.byCategory || []).slice(0, 5).map(c => c.count),
    backgroundColor: '#7c3aed',
    borderRadius: 4,
    borderSkipped: false
  }]
}))

const priorityChart = computed(() => ({
  labels: ['Baja', 'Media', 'Alta', 'Crítica'],
  datasets: [{
    data: priorityLegend.value.map(p => p.value),
    backgroundColor: ['#60a5fa', '#34d399', '#f59e0b', '#ef4444'],
    borderWidth: 0,
    hoverOffset: 3
  }]
}))
</script>
