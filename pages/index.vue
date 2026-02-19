<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">📊 Dashboard</h1>

    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="card bg-green-50 border-green-200">
        <p class="text-sm text-green-600">Abiertos</p>
        <p class="text-3xl font-bold text-green-700">{{ count('OPEN') }}</p>
      </div>
      <div class="card bg-yellow-50 border-yellow-200">
        <p class="text-sm text-yellow-600">En Progreso</p>
        <p class="text-3xl font-bold text-yellow-700">{{ count('IN_PROGRESS') }}</p>
      </div>
      <div class="card bg-gray-50 border-gray-200">
        <p class="text-sm text-gray-600">Cerrados</p>
        <p class="text-3xl font-bold text-gray-700">{{ count('CLOSED') }}</p>
      </div>
      <div class="card bg-indigo-50 border-indigo-200">
        <p class="text-sm text-indigo-600">Total</p>
        <p class="text-3xl font-bold text-indigo-700">{{ total }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div class="card">
        <h2 class="font-semibold mb-4">Tickets por Estado</h2>
        <Doughnut v-if="stats" :data="statusChart" />
      </div>
      <div class="card">
        <h2 class="font-semibold mb-4">Incidencias por Mes</h2>
        <Bar v-if="stats" :data="monthlyChart" />
      </div>
      <div class="card">
        <h2 class="font-semibold mb-4">Categorías más Recurrentes</h2>
        <Bar v-if="stats" :data="categoryChart" :options="{ indexAxis: 'y' }" />
      </div>
      <div class="card">
        <h2 class="font-semibold mb-4">Tickets por Prioridad</h2>
        <Doughnut v-if="stats" :data="priorityChart" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const { data: stats } = await useFetch('/api/stats')

const count = (status) => stats.value?.byStatus.find(s => s.label === status)?.count || 0
const total = computed(() => stats.value?.byStatus.reduce((a, b) => a + b.count, 0) || 0)

const statusChart = computed(() => ({
  labels: stats.value?.byStatus.map(s => s.label),
  datasets: [{ data: stats.value?.byStatus.map(s => s.count), backgroundColor: ['#22c55e', '#f59e0b', '#6b7280'] }]
}))

const monthlyChart = computed(() => ({
  labels: stats.value?.monthly.map(m => m.month).reverse(),
  datasets: [{ label: 'Tickets', data: stats.value?.monthly.map(m => m.count).reverse(), backgroundColor: '#6366f1' }]
}))

const categoryChart = computed(() => ({
  labels: stats.value?.byCategory.map(c => c.label),
  datasets: [{ label: 'Tickets', data: stats.value?.byCategory.map(c => c.count), backgroundColor: '#06b6d4' }]
}))

const priorityChart = computed(() => ({
  labels: stats.value?.byPriority.map(p => p.label),
  datasets: [{ data: stats.value?.byPriority.map(p => p.count), backgroundColor: ['#86efac', '#fde68a', '#f97316', '#ef4444'] }]
}))
</script>