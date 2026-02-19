<template>
  <div class="min-h-screen bg-gray-50 flex">

    <aside class="w-64 bg-white shadow-md flex flex-col">
      <div class="p-6 border-b">
        <h1 class="text-xl font-bold text-indigo-600">🎫 TicketSystem</h1>
        <p class="text-sm text-gray-500 mt-1">{{ auth.user?.name }}</p>
      </div>

      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink to="/"            class="nav-link">📊 Dashboard</NuxtLink>
        <NuxtLink to="/tickets"     class="nav-link">🎫 Tickets</NuxtLink>
        <NuxtLink to="/tickets/new" class="nav-link">➕ Nuevo Ticket</NuxtLink>
        <NuxtLink to="/users"       class="nav-link" v-if="auth.isAdmin">👥 Usuarios</NuxtLink>
      </nav>

      <div class="p-4 border-t">
        <button @click="auth.logout()" class="w-full text-left text-red-500 hover:text-red-700 text-sm">
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>

    <main class="flex-1 p-8 overflow-y-auto">
      <slot />
    </main>

  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()

onMounted(() => {
  auth.loadFromStorage()
  if (!auth.isLoggedIn) navigateTo('/login')
})
</script>

<style scoped>
.nav-link {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600
         hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium;
}
.nav-link.router-link-active {
  @apply bg-indigo-50 text-indigo-600;
}
</style>