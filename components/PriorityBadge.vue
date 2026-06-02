<template>
  <span class="badge" :style="styles[priority]">{{ labels[priority] }}</span>
</template>
<<<<<<< HEAD
=======

>>>>>>> cedc22be237c444deec09833a66085a6f0ecb67d
<script setup>
defineProps({ priority: String })
const labels = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', CRITICAL: 'Crítica' }
const styles = {
<<<<<<< HEAD
  LOW:      'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe',
  MEDIUM:   'background:#f0fdf4;color:#166534;border:1px solid #bbf7d0',
  HIGH:     'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa',
  CRITICAL: 'background:#fef2f2;color:#b91c1c;border:1px solid #fecaca'
}
</script>
=======
  LOW:      'background:#eff6ff; color:#1d4ed8;',
  MEDIUM:   'background:#f0fdf4; color:#16a34a;',
  HIGH:     'background:#fff7ed; color:#c2410c;',
  CRITICAL: 'background:#fef2f2; color:#dc2626;'
}
</script>
>>>>>>> cedc22be237c444deec09833a66085a6f0ecb67d
