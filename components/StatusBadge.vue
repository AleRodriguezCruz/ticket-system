<template>
  <span class="badge" :style="styles[status]">{{ labels[status] }}</span>
</template>

<script setup>
defineProps({ status: String })
const labels = { OPEN: 'Abierto', IN_PROGRESS: 'En progreso', CLOSED: 'Cerrado' }
const styles = {
  OPEN:        'background:#dcfce7; color:#16a34a;',
  IN_PROGRESS: 'background:#fef9c3; color:#b45309;',
  CLOSED:      'background:#f3f4f6; color:#6b7280;'
}
</script>