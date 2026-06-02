<template>
  <span class="badge" :style="styles[priority]">{{ labels[priority] }}</span>
</template>
<script setup>
defineProps({ priority: String })
const labels = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', CRITICAL: 'Crítica' }
const styles = {
  LOW:      'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe',
  MEDIUM:   'background:#f0fdf4;color:#166534;border:1px solid #bbf7d0',
  HIGH:     'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa',
  CRITICAL: 'background:#fef2f2;color:#b91c1c;border:1px solid #fecaca'
}
</script>
