<template>
  <div>
    <div class="mb-8">
      <h1 class="text-lg font-semibold" style="color: var(--text)">Dashboard</h1>
      <p class="text-xs mt-0.5" style="color: var(--muted)">Resumen general del sistema</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="card" v-for="stat in statCards" :key="stat.label">
        <p class="text-xs uppercase tracking-wider mb-2" style="color: var(--muted)">{{ stat.label }}</p>
        <p class="text-3xl font-semibold" :style="`color: ${stat.color}`">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-2 gap-4">
      <div class="card">
        <p class="text-xs uppercase tracking-wider mb-4" style="color: var(--muted)">Por Estado</p>
        <Doughnut v-if="stats" :data="statusChart" :options="chartOpts" />
      </div>
      <div class="card">
        <p class="text-xs uppercase tracking-wider mb-4" style="color: var(--muted)">Incidencias por Mes</p>
        <Bar v-if="stats" :data="monthlyChart" :options="chartOpts" />
      </div>
      <div class="card">
        <p class="text-xs uppercase tracking-wider mb-4" style="color: var(--muted)">Categorías Recurrentes</p>
        <Bar v-if="stats" :data="categoryChart" :options="{ ...chartOpts, indexAxis: 'y' }" />
      </div>
      <div class="card">
        <p class="text-xs uppercase tracking-wider mb-4" style="color: var(--muted)">Por Prioridad</p>
        <Doughnut v-if="stats" :data="priorityChart" :options="chartOpts" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { data: stats } = await useFetch('/api/stats')

const chartOpts = {
  responsive: true,
  plugins: { legend: { labels: { color: '#737373', font: { size: 11 } } } },
  scales: { x: { ticks: { color: '#737373' }, grid: { color: '#2a2a2a' } }, y: { ticks: { color: '#737373' }, grid: { color: '#2a2a2a' } } }
}

const count = (status) => stats.value?.byStatus.find(s => s.label === status)?.count || 0
const total = computed(() => stats.value?.byStatus.reduce((a, b) => a + b.count, 0) || 0)

const statCards = computed(() => [
  { label: 'Abiertos',    value: count('OPEN'),        color: '#10b981' },
  { label: 'En Progreso', value: count('IN_PROGRESS'), color: '#f59e0b' },
  { label: 'Cerrados',    value: count('CLOSED'),      color: '#737373' },
  { label: 'Total',       value: total.value,          color: '#e5e5e5' },
])

const statusChart = computed(() => ({
  labels: ['Abierto', 'En Progreso', 'Cerrado'],
  datasets: [{ data: stats.value?.byStatus.map(s => s.count), backgroundColor: ['#10b981', '#f59e0b', '#404040'], borderWidth: 0 }]
}))

const monthlyChart = computed(() => ({
  labels: stats.value?.monthly.map(m => m.month).reverse(),
  datasets: [{ label: 'Tickets', data: stats.value?.monthly.map(m => m.count).reverse(), backgroundColor: '#10b981', borderRadius: 4 }]
}))

const categoryChart = computed(() => ({
  labels: stats.value?.byCategory.map(c => c.label),
  datasets: [{ label: 'Tickets', data: stats.value?.byCategory.map(c => c.count), backgroundColor: '#6366f1', borderRadius: 4 }]
}))

const priorityChart = computed(() => ({
  labels: ['Baja', 'Media', 'Alta', 'Crítica'],
  datasets: [{ data: stats.value?.byPriority.map(p => p.count), backgroundColor: ['#818cf8', '#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }]
}))
</script>