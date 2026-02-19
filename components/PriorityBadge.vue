<template>
  <span class="badge" :style="styles[priority]">{{ labels[priority] }}</span>
</template>

<script setup>
defineProps({ priority: String })
const labels = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', CRITICAL: 'Crítica' }
const styles = {
  LOW:      'background:#eff6ff; color:#1d4ed8;',
  MEDIUM:   'background:#f0fdf4; color:#16a34a;',
  HIGH:     'background:#fff7ed; color:#c2410c;',
  CRITICAL: 'background:#fef2f2; color:#dc2626;'
}
</script>