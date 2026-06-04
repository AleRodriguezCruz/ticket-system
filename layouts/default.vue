<template>
  <div class="flex h-screen overflow-hidden" style="background: var(--bg)">

    <!-- SIDEBAR -->
    <aside class="flex flex-col flex-shrink-0 overflow-y-auto"
      style="width:228px; background:var(--sidebar); border-right:1px solid #0b1520">

      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-4" style="border-bottom:1px solid #0b1520; min-height:58px">
        <div class="flex items-center justify-center rounded-lg flex-shrink-0"
          style="width:32px;height:32px;background:linear-gradient(135deg,#1a56db,#3b82f6)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M20 12V22H4V12"/>
            <path d="M22 7H2v5h20V7z"/>
            <path d="M12 22V7"/>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
        </div>
        <div>
          <div class="font-semibold text-white text-sm leading-tight tracking-tight">TicketSystem</div>
          <div style="color:#4d6b8a;font-size:10.5px;font-weight:500">Epicor Kinetic Support</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-3">
        <p class="section-label">Principal</p>

        <NuxtLink to="/" class="nav-link" :class="{ active: $route.path === '/' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </NuxtLink>

        <NuxtLink to="/tickets" class="nav-link" :class="{ active: $route.path === '/tickets' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
          </svg>
          Tickets
          <span v-if="openCount > 0" class="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full"
            style="background:rgba(26,86,219,0.25);color:#7ab3f5;min-width:20px;text-align:center">
            {{ openCount }}
          </span>
        </NuxtLink>

        <NuxtLink to="/tickets/new" class="nav-link" :class="{ active: $route.path === '/tickets/new' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Nueva Incidencia
        </NuxtLink>

        <NuxtLink to="/knowledge" class="nav-link" :class="{ active: $route.path === '/knowledge' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          Base de Conocimiento
        </NuxtLink>

        <p class="section-label">Administración</p>

        <!-- ⭐ Usando el getter isAdmin para mejor reactividad -->
        <NuxtLink v-if="isAdmin" to="/users" class="nav-link"
          :class="{ active: $route.path === '/users' }">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Usuarios
        </NuxtLink>
      </nav>

      <!-- Usuario logueado -->
      <div class="px-3 py-3" style="border-top:1px solid #0b1520">
        <div class="flex items-center gap-2.5 px-2 py-1.5 rounded-lg" style="background:#162030">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold truncate" style="color:#c8d8e8">{{ userName }}</div>
            <div class="text-xs truncate" style="color:#4d6b8a;font-size:10px">{{ userRole }}</div>
          </div>
          <button @click="handleLogout" title="Cerrar sesión" class="flex-shrink-0 transition-colors rounded p-1"
            style="color:#4d6b8a" onmouseover="this.style.color='#7ab3f5';this.style.background='rgba(26,86,219,0.15)'"
            onmouseout="this.style.color='#4d6b8a';this.style.background='transparent'">
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
        style="height:58px;background:var(--header);border-bottom:1px solid #0b1520">
        <div class="flex items-center gap-2">
          <span class="text-sm font-semibold text-white">{{ pageTitle }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-xs" style="color:#4d6b8a">
            {{ currentDate }}
          </span>
          <div class="w-px h-4" style="background:#1c2e42"></div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
              {{ userInitials }}
            </div>
            <span class="text-xs font-medium" style="color:#7a8fa6">{{ userEmail }}</span>
          </div>
        </div>
      </header>

      <!-- Breadcrumb -->
      <div class="px-6 py-2 flex items-center gap-1.5 text-xs flex-shrink-0"
        style="background:#f4f5f7;border-bottom:1px solid var(--border-soft);color:var(--muted)">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
        <span>Inicio</span>
        <span style="color:var(--border)">›</span>
        <span style="color:var(--accent);font-weight:600">{{ pageTitle }}</span>
      </div>

      <!-- Content -->
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

// ⭐ Cargar sesión al montar el layout
onMounted(() => {
  authStore.loadFromStorage()
  console.log('📦 Layout mounted - User:', user.value)
  console.log('👑 isAdmin:', isAdmin.value)
})

// Computed properties para el template
const userName = computed(() => user.value?.name || 'Usuario')
const userEmail = computed(() => user.value?.email || '')
const userRole = computed(() => user.value?.role || '')
const userInitials = computed(() => {
  const name = user.value?.name || ''
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const pageTitle = computed(() => {
  const map = {
    '/': 'Dashboard',
    '/tickets': 'Gestión de Tickets',
    '/tickets/new': 'Nueva Incidencia',
    '/users': 'Administración de Usuarios',
    '/knowledge': 'Base de Conocimiento',
  }
  return map[route.path] || 'Detalle de Ticket'
})

// Count open tickets for badge
const openCount = ref(0)

onMounted(async () => {
  try {
    const res = await $fetch('/api/stats')
    openCount.value = res?.byStatus?.find(s => s.label === 'OPEN')?.count || 0
  } catch {}
})

// ⭐ Manejador de logout
const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
.section-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #4d6b8a;
  margin: 16px 12px 8px 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #8ea3b8;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(26, 86, 219, 0.15);
  color: #7ab3f5;
}

.nav-link.active {
  background: rgba(26, 86, 219, 0.25);
  color: #7ab3f5;
}
</style>
