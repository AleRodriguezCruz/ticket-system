<template>
  <div>
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
  </div>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
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
}))
</script>
