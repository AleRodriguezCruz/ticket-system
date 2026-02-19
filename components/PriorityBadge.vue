<template>
  <span :class="styles[priority]" class="px-2 py-1 rounded-full text-xs font-semibold">
    {{ labels[priority] }}
  </span>
</template>

<script setup>
const props = defineProps({ priority: String })
const { priority } = props
const labels = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta', CRITICAL: 'Crítica' }
const styles = {
  LOW:      'bg-blue-100 text-blue-600',
  MEDIUM:   'bg-green-100 text-green-600',
  HIGH:     'bg-orange-100 text-orange-600',
  CRITICAL: 'bg-red-100 text-red-600'
}
</script>