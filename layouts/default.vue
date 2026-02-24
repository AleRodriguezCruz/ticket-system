<template>
  <div class="flex h-screen overflow-hidden" style="background: var(--bg)">

    <!-- SIDEBAR -->
    <aside class="flex flex-col flex-shrink-0 overflow-y-auto"
      style="width: 220px; background: var(--sidebar); border-right: 1px solid #0d1f33">

      <!-- Logo estilo Epicor -->
      <div class="flex items-center gap-2 px-4 py-4"
        style="border-bottom: 1px solid #0d1f33; min-height: 56px">
        <div class="flex items-center justify-center rounded"
          style="width:28px; height:28px; background: #0066cc">
          <span class="text-white font-bold text-xs">TS</span>
        </div>
        <div>
          <div class="font-bold text-white text-sm leading-tight">TicketSystem</div>
          <div class="text-xs" style="color:#6b8aa8; font-size:10px">Visionaire Lighting</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-0.5">
        <p class="px-2 mb-1 text-xs font-semibold uppercase tracking-wider" style="color:#4a6680; font-size:10px">
          Principal
        </p>
        <NuxtLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/tickets" class="nav-link" :class="{ active: $route.path.startsWith('/tickets') }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
          Tickets
        </NuxtLink>
        <NuxtLink to="/tickets/new" class="nav-link" :class="{ active: $route.path === '/tickets/new' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          Nueva Incidencia
        </NuxtLink>

        <p class="px-2 mt-4 mb-1 text-xs font-semibold uppercase tracking-wider" style="color:#4a6680; font-size:10px">
          Administración
        </p>
        <NuxtLink v-if="auth.user?.role === 'ADMIN'" to="/users" class="nav-link"
          :class="{ active: $route.path === '/users' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Usuarios
        </NuxtLink>
      </nav>

      <!-- Usuario logueado -->
      <div class="px-3 py-3" style="border-top: 1px solid #0d1f33">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style="background: #0066cc">
            {{ auth.user?.name?.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-white truncate">{{ auth.user?.name }}</div>
            <div class="text-xs truncate" style="color:#4a6680">{{ auth.user?.role }}</div>
          </div>
          <button @click="auth.logout()" title="Cerrar sesión"
            class="flex-shrink-0 transition-colors" style="color:#4a6680"
            onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#4a6680'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="flex flex-col flex-1 overflow-hidden">

      <!-- TOPBAR estilo Epicor -->
      <header class="flex items-center justify-between px-6 flex-shrink-0"
        style="height:56px; background: var(--header); border-bottom: 1px solid #0d1f33">
        <div class="text-sm font-semibold text-white">
          {{ pageTitle }}
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs" style="color:#6b8aa8">
            {{ new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' }) }}
          </span>
          <div class="w-px h-4" style="background:#2a4060"></div>
          <span class="text-xs font-medium" style="color:#a8bcce">{{ auth.user?.email }}</span>
        </div>
      </header>

      <!-- Breadcrumb bar -->
      <div class="px-6 py-2 flex items-center gap-1 text-xs flex-shrink-0"
        style="background:#eef1f5; border-bottom:1px solid var(--border); color: var(--muted)">
        <span>Inicio</span>
        <span class="mx-1">›</span>
        <span style="color: var(--accent); font-weight:600">{{ pageTitle }}</span>
      </div>

      <!-- Contenido -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()
const route = useRoute()

const pageTitle = computed(() => {
  const map = {
    '/': 'Dashboard',
    '/tickets': 'Gestión de Tickets',
    '/tickets/new': 'Nueva Incidencia',
    '/users': 'Administración de Usuarios',
  }
  return map[route.path] || 'Tickets'
})
</script>