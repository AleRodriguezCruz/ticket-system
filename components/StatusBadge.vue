<template>
  <span class="badge" :style="styles[status]">
    <span class="inline-block w-1.5 h-1.5 rounded-full" :style="`background:${dots[status]}`"></span>
    {{ labels[status] }}
  </span>
</template>
<script setup>
defineProps({ status: String })
const labels = { OPEN: 'Abierto', IN_PROGRESS: 'En progreso', CLOSED: 'Cerrado' }
const dots   = { OPEN: '#059669', IN_PROGRESS: '#d97706', CLOSED: '#94a3b8' }
const styles = {
  OPEN:        'background:#dcfce7;color:#166534;border:1px solid #bbf7d0',
  IN_PROGRESS: 'background:#fef9c3;color:#92400e;border:1px solid #fde68a',
  CLOSED:      'background:#f3f4f6;color:#4b5563;border:1px solid #e5e7eb'
}
</script>
