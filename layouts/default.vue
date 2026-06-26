<template>
  <div class="flex h-screen overflow-hidden" style="background:var(--bg)">

    <!-- SIDEBAR -->
    <aside class="flex flex-col flex-shrink-0"
      style="width:224px;background:var(--sidebar);border-right:1px solid rgba(255,255,255,0.04)">

      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-4"
        style="border-bottom:1px solid rgba(255,255,255,0.05);min-height:57px">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style="background:linear-gradient(135deg,#1a56db,#3b82f6);box-shadow:0 4px 12px rgba(26,86,219,0.35)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M15 5H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
            <path d="M9 9h6M9 12h4M9 15h3"/>
          </svg>
        </div>
        <div>
          <div class="text-sm font-semibold text-white leading-tight">TicketSystem</div>
          <div style="font-size:10px;color:#3d6080;font-weight:500;letter-spacing:0.3px">Epicor · Soporte TI</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-3 overflow-y-auto">
        <p class="nav-section-label">Principal</p>

        <NuxtLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/>
          </svg>
          Dashboard
        </NuxtLink>

        <NuxtLink to="/tickets" class="nav-link" :class="{ active: route.path === '/tickets' }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="12" y2="17"/>
          </svg>
          Tickets
          <span v-if="openCount > 0"
            class="ml-auto font-semibold rounded-full px-1.5 py-0.5"
            style="font-size:10px;background:rgba(26,86,219,0.22);color:#93c5fd;min-width:18px;text-align:center">
            {{ openCount > 99 ? '99+' : openCount }}
          </span>
        </NuxtLink>

        <NuxtLink to="/tickets/new" class="nav-link" :class="{ active: route.path === '/tickets/new' }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Nueva Incidencia
        </NuxtLink>

        <NuxtLink to="/knowledge" class="nav-link" :class="{ active: route.path === '/knowledge' }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="9" y1="7" x2="15" y2="7"/>
            <line x1="9" y1="11" x2="13" y2="11"/>
          </svg>
          Base de Conocimiento
        </NuxtLink>

        <template v-if="isAdmin">
          <p class="nav-section-label">Administración</p>
          <NuxtLink to="/users" class="nav-link" :class="{ active: route.path === '/users' }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Usuarios
          </NuxtLink>
        </template>
      </nav>

      <!-- Footer: usuario -->
      <div class="px-3 py-3" style="border-top:1px solid rgba(255,255,255,0.05)">
        <div class="flex items-center gap-2.5 px-2 py-2 rounded-lg transition-colors cursor-default"
          style="background:rgba(255,255,255,0.03)">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style="background:linear-gradient(135deg,#1a56db,#60a5fa)">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold truncate" style="color:#c0d4e8">{{ userName }}</div>
            <div class="truncate" style="font-size:10px;color:#2d4a6a;font-weight:500">{{ userRole }}</div>
          </div>
          <button @click="handleLogout" title="Cerrar sesión"
            class="flex-shrink-0 p-1.5 rounded-md transition-colors" style="color:#2d4a6a"
            onmouseover="this.style.background='rgba(255,255,255,0.06)';this.style.color='#7ab3f5'"
            onmouseout="this.style.background='transparent';this.style.color='#2d4a6a'">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

      <!-- TOPBAR -->
      <header class="flex items-center justify-between px-6 flex-shrink-0"
        style="height:57px;background:var(--header);border-bottom:1px solid rgba(255,255,255,0.04)">
        <div class="flex items-center gap-3">
          <span class="text-sm font-semibold text-white tracking-tight">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center gap-5">
          <span class="text-xs capitalize" style="color:#3d6080">{{ currentDate }}</span>
          <div class="w-px h-3.5" style="background:rgba(255,255,255,0.06)"></div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style="background:linear-gradient(135deg,#1a56db,#60a5fa)">
              {{ userInitials }}
            </div>
            <span class="text-xs" style="color:#4a6a80">{{ userEmail }}</span>
          </div>
        </div>
      </header>

      <!-- BREADCRUMB -->
      <div class="flex items-center gap-1.5 px-6 py-2 text-xs flex-shrink-0"
        style="background:var(--surface2);border-bottom:1px solid var(--border-soft)">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--muted-2)">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        <span style="color:var(--muted-2)">Inicio</span>
        <span style="color:var(--border)">›</span>
        <span style="color:var(--accent);font-weight:600">{{ pageTitle }}</span>
      </div>

      <!-- CONTENT -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user, isAdmin } = storeToRefs(authStore)
const route = useRoute()

const userName    = computed(() => user.value?.name || 'Usuario')
const userEmail   = computed(() => user.value?.email || '')
const userRole    = computed(() => ({ ADMIN:'Administrador', AGENT:'Agente', USER:'Usuario' }[user.value?.role] || ''))
const userInitials= computed(() => (user.value?.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2))

const currentDate = computed(() =>
  new Date().toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
)

const pageTitle = computed(() => {
  const m = {
    '/': 'Dashboard', '/tickets': 'Tickets',
    '/tickets/new': 'Nueva Incidencia',
    '/users': 'Usuarios', '/knowledge': 'Base de Conocimiento',
  }
  if (route.path.startsWith('/tickets/')) return 'Detalle de Ticket'
  return m[route.path] || 'TicketSystem'
})


const openCount = ref(0)
onMounted(async () => {
  try {
    const tickets = await $fetch('/api/tickets', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    openCount.value = (Array.isArray(tickets) ? tickets : []).filter(t => t.status === 'OPEN').length
  } catch {}
})

function handleLogout() { authStore.logout() }
</script>
