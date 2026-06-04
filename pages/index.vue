<template>
  <div class="dashboard-container">

    <!-- ═══════════════════════════════════════
         ADMIN / AGENT VIEW
    ═══════════════════════════════════════ -->
    <template v-if="isAdminOrAgent">
      <!-- Hero Header -->
      <div class="hero-section">
        <div class="hero-content">
          <div>
            <h1 class="hero-title">
              Hola, {{ firstName }} <span class="wave">👋</span>
            </h1>
            <p class="hero-subtitle">
              {{ today }} · Panel de administración
            </p>
          </div>
          <NuxtLink to="/tickets/new" class="btn-primary btn-glow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nueva Incidencia
          </NuxtLink>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card-v2 stat-card-green">
          <div class="stat-card-header">
            <span class="stat-label">Abiertos</span>
            <div class="stat-icon stat-icon-green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
          </div>
          <p class="stat-value stat-value-green">{{ count('OPEN') }}</p>
          <p class="stat-footer">Requieren atención</p>
        </div>

        <div class="stat-card-v2 stat-card-amber">
          <div class="stat-card-header">
            <span class="stat-label">En Progreso</span>
            <div class="stat-icon stat-icon-amber">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/>
              </svg>
            </div>
          </div>
          <p class="stat-value stat-value-amber">{{ count('IN_PROGRESS') }}</p>
          <p class="stat-footer">Siendo atendidos</p>
        </div>

        <div class="stat-card-v2 stat-card-slate">
          <div class="stat-card-header">
            <span class="stat-label">Cerrados</span>
            <div class="stat-icon stat-icon-slate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
          </div>
          <p class="stat-value stat-value-slate">{{ count('CLOSED') }}</p>
          <p class="stat-footer">Resueltos total</p>
        </div>

        <div class="stat-card-v2 stat-card-blue">
          <div class="stat-card-header">
            <span class="stat-label">Base Conocim.</span>
            <div class="stat-icon stat-icon-blue">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
          </div>
          <p class="stat-value stat-value-blue">{{ knowledgeCount }}</p>
          <p class="stat-footer">Artículos documentados</p>
        </div>
      </div>

      <!-- Charts Row 1 -->
      <div class="charts-row">
        <!-- Doughnut: Status -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">Por Estado</span>
          </div>
          <div class="doughnut-wrapper">
            <Doughnut :data="statusChart" :options="doughnutOpts" />
          </div>
          <div class="chart-legend">
            <div v-for="item in statusLegend" :key="item.label" class="legend-item">
              <div class="legend-dot" :style="{ background: item.color }"></div>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Bar: Monthly -->
        <div class="chart-card chart-card-expanded">
          <div class="chart-header">
            <span class="chart-title">Incidencias por Mes</span>
            <span class="chart-badge">Últimos 6 meses</span>
          </div>
          <div class="bar-wrapper">
            <Bar :data="monthlyChart" :options="barOpts" />
          </div>
        </div>

        <!-- Doughnut: Priority -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">Por Prioridad</span>
          </div>
          <div class="doughnut-wrapper">
            <Doughnut :data="priorityChart" :options="doughnutOpts" />
          </div>
          <div class="chart-legend">
            <div v-for="item in priorityLegend" :key="item.label" class="legend-item">
              <div class="legend-dot" :style="{ background: item.color }"></div>
              <span class="legend-label">{{ item.label }}</span>
              <span class="legend-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row 2 -->
      <div class="charts-row-bottom">
        <!-- Categories Bar -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">Top Categorías</span>
          </div>
          <div class="bar-wrapper-horizontal">
            <Bar :data="categoryChart" :options="categoryOpts" />
          </div>
        </div>

        <!-- Recent Tickets -->
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">Recientes</span>
            <NuxtLink to="/tickets" class="view-all-link">Ver todos →</NuxtLink>
          </div>
          <div class="recent-list">
            <div
              v-for="t in recentTickets"
              :key="t.id"
              class="recent-item"
              @click="navigateTo(`/tickets/${t.id}`)"
            >
              <div class="recent-info">
                <p class="recent-title">{{ t.title }}</p>
                <p class="recent-category">{{ t.category }}</p>
              </div>
              <StatusBadge :status="t.status" />
            </div>
            <div v-if="!recentTickets.length" class="empty-state">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
              <p>Sin incidencias aún</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════════════════════════
         USER VIEW
    ═══════════════════════════════════════ -->
    <template v-else>
      <div class="hero-section-user">
        <div>
          <h1 class="hero-title">
            Hola, {{ firstName }} <span class="wave">👋</span>
          </h1>
          <p class="hero-subtitle">Consulta el estado de tus incidencias o reporta una nueva</p>
        </div>
      </div>

      <!-- User Stats -->
      <div class="stats-grid stats-grid-3">
        <div class="stat-card-v2 stat-card-green">
          <div class="stat-card-header">
            <span class="stat-label">Mis Abiertos</span>
            <div class="stat-icon stat-icon-green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
            </div>
          </div>
          <p class="stat-value stat-value-green">{{ myCount('OPEN') }}</p>
          <p class="stat-footer">Pendientes</p>
        </div>

        <div class="stat-card-v2 stat-card-amber">
          <div class="stat-card-header">
            <span class="stat-label">En Progreso</span>
            <div class="stat-icon stat-icon-amber">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/>
              </svg>
            </div>
          </div>
          <p class="stat-value stat-value-amber">{{ myCount('IN_PROGRESS') }}</p>
          <p class="stat-footer">Siendo atendidos</p>
        </div>

        <div class="stat-card-v2 stat-card-slate">
          <div class="stat-card-header">
            <span class="stat-label">Cerrados</span>
            <div class="stat-icon stat-icon-slate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
          </div>
          <p class="stat-value stat-value-slate">{{ myCount('CLOSED') }}</p>
          <p class="stat-footer">Resueltos</p>
        </div>
      </div>

      <!-- CTA Banner -->
      <div class="cta-banner">
        <div class="cta-content">
          <div class="cta-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div>
            <p class="cta-title">¿Problema con Epicor Kinetic?</p>
            <p class="cta-subtitle">El equipo de soporte atenderá tu incidencia a la brevedad</p>
          </div>
        </div>
        <NuxtLink to="/tickets/new" class="btn-primary btn-glow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva Incidencia
        </NuxtLink>
      </div>

      <!-- My Tickets -->
      <div class="tickets-card">
        <div class="tickets-card-header">
          <span class="tickets-title">Mis incidencias</span>
          <NuxtLink to="/tickets" class="view-all-link">Ver todas →</NuxtLink>
        </div>

        <div class="tickets-list">
          <div
            v-for="t in myRecentTickets"
            :key="t.id"
            class="ticket-item"
            @click="navigateTo(`/tickets/${t.id}`)"
          >
            <div class="ticket-info">
              <div class="ticket-meta">
                <span class="ticket-id">#{{ t.id }}</span>
                <span class="ticket-category">{{ t.category }}</span>
              </div>
              <p class="ticket-title">{{ t.title }}</p>
              <p class="ticket-date">
                {{ formatDate(t.createdAt) }}
                <span v-if="t.assignedTo"> · {{ t.assignedTo.name }}</span>
              </p>
            </div>
            <div class="ticket-badges">
              <StatusBadge :status="t.status" />
              <PriorityBadge :priority="t.priority" />
            </div>
          </div>

          <div v-if="!myRecentTickets.length" class="empty-state-large">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
            <p>Sin incidencias aún</p>
            <p class="empty-hint">Usa el botón de arriba para reportar tu primer problema</p>
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

Chart.register(...registerables)

const auth = useAuthStore()

const { data: stats } = await useFetch('/api/stats')
const { data: tickets } = await useFetch('/api/tickets')
const { data: knowledge } = await useFetch('/api/knowledge')

const isAdminOrAgent = computed(() => auth.user?.role !== 'USER')
const firstName = computed(() => auth.user?.name?.split(' ')[0] || '')
const today = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Admin counts
const count = (s) => stats.value?.byStatus.find(x => x.label === s)?.count || 0
const knowledgeCount = computed(() => knowledge.value?.length || 0)
const recentTickets = computed(() => (tickets.value || []).slice(0, 6))

// User counts
const myTickets = computed(() => (tickets.value || []).filter(t => t.createdById === auth.user?.id))
const myCount = (s) => myTickets.value.filter(t => t.status === s).length
const myRecentTickets = computed(() => myTickets.value.slice(0, 8))

// Legends
const statusLegend = computed(() => [
  { label: 'Abierto', color: '#059669', value: count('OPEN') },
  { label: 'En Progreso', color: '#d97706', value: count('IN_PROGRESS') },
  { label: 'Cerrado', color: '#94a3b8', value: count('CLOSED') },
])

const priorityLegend = computed(() => [
  { label: 'Baja', color: '#60a5fa', value: stats.value?.byPriority.find(p => p.label === 'LOW')?.count || 0 },
  { label: 'Media', color: '#34d399', value: stats.value?.byPriority.find(p => p.label === 'MEDIUM')?.count || 0 },
  { label: 'Alta', color: '#f59e0b', value: stats.value?.byPriority.find(p => p.label === 'HIGH')?.count || 0 },
  { label: 'Crítica', color: '#ef4444', value: stats.value?.byPriority.find(p => p.label === 'CRITICAL')?.count || 0 },
])

// Chart options
const doughnutOpts = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
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

// Chart data
const statusChart = computed(() => ({
  labels: ['Abierto', 'En Progreso', 'Cerrado'],
  datasets: [{
    data: [count('OPEN'), count('IN_PROGRESS'), count('CLOSED')],
    backgroundColor: ['#059669', '#d97706', '#94a3b8'],
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

const monthlyChart = computed(() => ({
  labels: (stats.value?.monthly || []).map(m => m.month.slice(5)).reverse(),
  datasets: [{
    data: (stats.value?.monthly || []).map(m => m.count).reverse(),
    backgroundColor: '#1a56db',
    borderRadius: 6,
    barPercentage: 0.65
  }]
}))

const categoryChart = computed(() => ({
  labels: (stats.value?.byCategory || []).slice(0, 5).map(c => c.label),
  datasets: [{
    data: (stats.value?.byCategory || []).slice(0, 5).map(c => c.count),
    backgroundColor: '#7c3aed',
    borderRadius: 4,
    barPercentage: 0.7
  }]
}))

const priorityChart = computed(() => ({
  labels: ['Baja', 'Media', 'Alta', 'Crítica'],
  datasets: [{
    data: priorityLegend.value.map(p => p.value),
    backgroundColor: ['#60a5fa', '#34d399', '#f59e0b', '#ef4444'],
    borderWidth: 0,
    hoverOffset: 4
  }]
}))
</script>

<style scoped>
.dashboard-container {
  animation: fadeInUp 0.4s ease-out;
}

/* Hero Section */
.hero-section {
  margin-bottom: 28px;
}

.hero-section-user {
  margin-bottom: 24px;
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.hero-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.3px;
}

.wave {
  display: inline-block;
  animation: wave 0.5s ease;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

.hero-subtitle {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 4px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stats-grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.stat-card-v2 {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 18px 20px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card-v2:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.stat-card-v2::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.stat-card-green::before { background: linear-gradient(90deg, #059669, #34d399); }
.stat-card-amber::before { background: linear-gradient(90deg, #d97706, #fbbf24); }
.stat-card-slate::before { background: linear-gradient(90deg, #64748b, #94a3b8); }
.stat-card-blue::before { background: linear-gradient(90deg, #1a56db, #60a5fa); }

.stat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--muted);
}

.stat-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-green { background: rgba(5, 150, 105, 0.1); }
.stat-icon-amber { background: rgba(217, 119, 6, 0.1); }
.stat-icon-slate { background: rgba(100, 116, 139, 0.1); }
.stat-icon-blue { background: rgba(26, 86, 219, 0.1); }

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -1px;
  margin-bottom: 6px;
}

.stat-value-green { color: #059669; }
.stat-value-amber { color: #d97706; }
.stat-value-slate { color: #64748b; }
.stat-value-blue { color: #1a56db; }

.stat-footer {
  font-size: 0.7rem;
  color: var(--muted-2);
}

/* Charts Row */
.charts-row {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 16px;
  margin-bottom: 16px;
}

.charts-row-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
}

.chart-card-expanded {
  grid-column: span 1;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.chart-title {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--muted);
}

.chart-badge {
  font-size: 0.6rem;
  background: var(--accent-soft);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.doughnut-wrapper {
  position: relative;
  width: 100%;
  height: 120px;
  margin-bottom: 10px;
}

.bar-wrapper {
  position: relative;
  width: 100%;
  height: 170px;
}

.bar-wrapper-horizontal {
  position: relative;
  width: 100%;
  height: 200px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 0.7rem;
  color: var(--muted);
  flex: 1;
}

.legend-value {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text);
}

/* Recent List */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--surface2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.recent-item:hover {
  background: var(--surface3);
  transform: translateX(2px);
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-category {
  font-size: 0.65rem;
  color: var(--muted-2);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* CTA Banner */
.cta-banner {
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cta-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #1a56db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cta-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f1923;
}

.cta-subtitle {
  font-size: 0.7rem;
  color: #4b5563;
  margin-top: 2px;
}

/* Tickets Card */
.tickets-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.tickets-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft);
}

.tickets-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.view-all-link {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.15s;
}

.view-all-link:hover {
  opacity: 0.8;
}

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
}

.ticket-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: var(--surface2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.ticket-item:hover {
  background: var(--surface3);
  transform: translateX(3px);
}

.ticket-info {
  flex: 1;
  min-width: 0;
}

.ticket-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.ticket-id {
  font-size: 0.65rem;
  font-family: monospace;
  color: var(--muted-2);
}

.ticket-category {
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--surface3);
  color: var(--muted);
}

.ticket-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ticket-date {
  font-size: 0.65rem;
  color: var(--muted-2);
  margin-top: 4px;
}

.ticket-badges {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  flex-shrink: 0;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: var(--muted-2);
}

.empty-state svg {
  opacity: 0.4;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 0.75rem;
}

.empty-state-large {
  text-align: center;
  padding: 48px 24px;
  color: var(--muted-2);
}

.empty-state-large svg {
  opacity: 0.3;
  margin-bottom: 12px;
}

.empty-state-large p {
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.empty-hint {
  font-size: 0.7rem !important;
  color: var(--muted-2);
}

/* Button Glow Effect */
.btn-glow {
  transition: all 0.2s ease;
}

.btn-glow:hover {
  box-shadow: 0 4px 14px rgba(26, 86, 219, 0.4);
  transform: translateY(-1px);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .charts-row-bottom {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid,
  .stats-grid-3 {
    grid-template-columns: 1fr;
  }
  
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cta-banner {
    flex-direction: column;
    text-align: center;
  }
  
  .cta-content {
    flex-direction: column;
    text-align: center;
  }
  
  .ticket-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .ticket-badges {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }
}
</style>
