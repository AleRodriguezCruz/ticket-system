<template>
  <div class="min-h-screen flex" style="background:#060e18">

    <!-- Left panel -->
    <div class="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10 relative overflow-hidden"
      style="background:linear-gradient(145deg,#0d1b2a,#0a1628)">

      <!-- Grid -->
      <div class="absolute inset-0 opacity-[0.035]"
        style="background-image:linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px);background-size:40px 40px"></div>

      <!-- Glow -->
      <div class="absolute" style="top:-80px;left:-80px;width:320px;height:320px;background:radial-gradient(circle,rgba(26,86,219,0.15) 0%,transparent 70%);pointer-events:none"></div>

      <div class="relative">
        <div class="flex items-center gap-3 mb-12">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center"
            style="background:linear-gradient(135deg,#1a56db,#3b82f6);box-shadow:0 6px 20px rgba(26,86,219,0.4)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M15 5H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
              <path d="M9 9h6M9 12h4M9 15h3"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-white tracking-tight">TicketSystem</span>
        </div>

        <h2 class="text-2xl font-bold text-white mb-3 leading-snug">
          Gestiona incidencias<br>de Epicor Kinetic
        </h2>
        <p class="text-sm leading-relaxed" style="color:#3d6080">
          Centraliza, prioriza y resuelve cada solicitud de soporte de manera eficiente con trazabilidad completa.
        </p>
      </div>

      <div class="relative space-y-3">
        <div v-for="f in features" :key="f.text"
          class="flex items-center gap-3 text-xs" style="color:#4a6a80">
          <div class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style="background:rgba(26,86,219,0.15)">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          {{ f.text }}
        </div>
      </div>
    </div>

    <!-- Right panel -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-[360px]">

        <!-- Mobile logo -->
        <div class="flex items-center gap-2.5 mb-8 lg:hidden">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center"
            style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M15 5H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
              <path d="M9 9h6M9 12h4"/>
            </svg>
          </div>
          <span class="text-base font-bold text-white">TicketSystem</span>
        </div>

        <h1 class="text-xl font-semibold mb-1" style="color:#e2eaf2">Iniciar sesión</h1>
        <p class="text-sm mb-7" style="color:#3d6080">Ingresa con tus credenciales corporativas</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label" style="color:#3d6080">Correo electrónico</label>
            <input v-model="form.email" type="email"
              class="input" style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);color:#e2eaf2"
              placeholder="usuario@empresa.com" required autocomplete="email" />
          </div>
          <div>
            <label class="label" style="color:#3d6080">Contraseña</label>
            <input v-model="form.password" type="password"
              class="input" style="background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);color:#e2eaf2"
              placeholder="••••••••" required autocomplete="current-password" />
          </div>

          <div v-if="error" class="rounded-lg px-3 py-2.5 text-xs flex items-center gap-2"
            style="background:rgba(220,38,38,0.1);color:#fca5a5;border:1px solid rgba(220,38,38,0.2)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full mt-1" :disabled="loading"
            style="padding:9px;font-size:13.5px;font-weight:600">
            <svg v-if="loading" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ loading ? 'Verificando...' : 'Ingresar' }}
          </button>
        </form>

        <p class="text-center text-xs mt-6" style="color:#1e3048">
          Acceso exclusivo para usuarios autorizados
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder { color: #1e3a52 !important; }
input:focus { border-color: rgba(59,130,246,0.5) !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.15) !important; }
</style>

<script setup>
definePageMeta({ layout: false })
import { useAuthStore } from '~/stores/auth'

const auth    = useAuthStore()
const form    = reactive({ email: '', password: '' })
const error   = ref('')
const loading = ref(false)

const features = [
  { text: 'Categorías específicas de Epicor Kinetic' },
  { text: 'Trazabilidad completa con comentarios' },
  { text: 'Dashboard con estadísticas en tiempo real' },
  { text: 'Control de acceso por roles (ADMIN/AGENT/USER)' },
]

onMounted(() => { if (auth.isLoggedIn) navigateTo('/') })

async function handleLogin() {
  loading.value = true
  error.value   = ''
  try {
    const res = await $fetch('/api/auth/login', { method: 'POST', body: form })
    auth.setAuth(res.user, res.token)
    navigateTo('/')
  } catch (e) {
    error.value = e?.data?.message || 'Credenciales incorrectas'
  } finally {
    loading.value = false
  }
}
</script>
