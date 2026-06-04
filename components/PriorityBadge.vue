<template>
  <span class="badge" :style="styles[priority]">{{ labels[priority] }}</span>
</template>

<script setup>
defineProps({ 
  priority: {
    type: String,
    required: true,
    validator: (value) => ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(value)
  }
})

const labels = { 
  LOW: 'Baja', 
  MEDIUM: 'Media', 
  HIGH: 'Alta', 
  CRITICAL: 'Crítica' 
}

const styles = {
  LOW:      'background:#eff6ff; color:#1d4ed8; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:500; display:inline-block;',
  MEDIUM:   'background:#f0fdf4; color:#16a34a; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:500; display:inline-block;',
  HIGH:     'background:#fff7ed; color:#c2410c; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:500; display:inline-block;',
  CRITICAL: 'background:#fef2f2; color:#dc2626; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:500; display:inline-block;'
}
</script>

<style scoped>
.badge {
  display: inline-block;
  white-space: nowrap;
}
</style>
