<template>
  <span :class="styles[status]" class="px-2 py-1 rounded-full text-xs font-semibold">
    {{ labels[status] }}
  </span>
</template>

<script setup>
const props = defineProps({ status: String })
const { status } = props
const labels = { OPEN: 'Abierto', IN_PROGRESS: 'En Progreso', CLOSED: 'Cerrado' }
const styles = {
  OPEN:        'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  CLOSED:      'bg-gray-100 text-gray-500'
}
</script>