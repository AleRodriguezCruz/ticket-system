<template>
  <div class="min-h-screen flex" style="background: var(--bg)">

    <!-- Sidebar -->
    <aside class="w-60 flex flex-col fixed h-full" style="background: var(--sidebar)">

      <!-- Logo -->
      <div class="px-4 py-4 border-b border-white/10">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style="background: var(--accent)">
            TS
          </div>
          <div>
            <p class="text-sm font-semibold text-white">TicketSystem</p>
            <p class="text-xs" style="color: #9ca3af">Panel de soporte</p>
          </div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-0.5">
        <p class="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style="color: #6b7280">Principal</p>
        <NuxtLink to="/" class="nav-link">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/tickets" class="nav-link">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          Tickets
        </NuxtLink>
        <NuxtLink to="/tickets/new" class="nav-link">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nuevo Ticket
        </NuxtLink>

        <div v-if="auth.isAdmin">
          <p class="px-3 mt-4 mb-2 text-xs font-semibold uppercase tracking-wider" style="color: #6b7280">Administración</p>
          <NuxtLink to="/users" class="nav-link">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"/></svg>
            Usuarios
          </NuxtLink>
        </div>
      </nav>

      <!-- User -->
      <div class="px-3 py-4 border-t border-white/10">
        <div class="flex items-center gap-2.5 px-3 py-2 rounded-md" style="background: rgba(255,255,255,0.06)">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style="background: var(--accent)">
            {{ auth.user?.name?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-white truncate">{{ auth.user?.name }}</p>
            <p class="text-xs truncate" style="color: #9ca3af">{{ auth.user?.role }}</p>
          </div>
          <button @click="auth.logout()" title="Cerrar sesión">
            <svg class="w-4 h-4" style="color: #9ca3af" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 ml-60 min-h-screen">
      <!-- Top bar -->
      <div class="px-8 py-3 border-b flex items-center justify-between" style="background: var(--surface); border-color: var(--border)">
        <p class="text-xs" style="color: var(--muted)">Bienvenido, <span class="font-medium" style="color: var(--text)">{{ auth.user?.name }}</span></p>
        <p class="text-xs" style="color: var(--muted)">{{ new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
      </div>
      <div class="p-8">
        <slot />
      </div>
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