<template>
  <div class="min-h-screen flex" style="background:#f8fafc">

    <!-- Left panel — branding -->
    <div class="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 p-12 relative overflow-hidden"
      style="background:linear-gradient(160deg,#1a1f36 0%,#111827 60%,#0f172a 100%)">

      <!-- Fondo decorativo -->
      <div class="absolute inset-0"
        style="background:radial-gradient(ellipse at 20% 20%,rgba(99,102,241,0.25) 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,rgba(16,185,129,0.15) 0%,transparent 50%)">
      </div>
      <div class="absolute inset-0 opacity-[0.04]"
        style="background-image:linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px);background-size:48px 48px">
      </div>

      <!-- Logo -->
      <div class="relative flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
          style="background:linear-gradient(135deg,#6366f1,#8b5cf6)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M15 5H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
            <path d="M9 9h6M9 12h4M9 15h3"/>
          </svg>
        </div>
        <div>
          <span class="text-lg font-bold text-white tracking-tight">TicketSystem</span>
          <p class="text-xs" style="color:#6366f1;font-weight:600">Epicor · Soporte TI</p>
        </div>
      </div>

      <!-- Mensaje central -->
      <div class="relative">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style="background:rgba(99,102,241,0.15);color:#a5b4fc;border:1px solid rgba(99,102,241,0.2)">
          <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
          Sistema en línea · 100% operativo
        </div>

        <h2 class="text-3xl font-bold text-white mb-4 leading-tight">
          Soporte técnico<br>
          <span style="background:linear-gradient(90deg,#6366f1,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent">
            más inteligente
          </span>
        </h2>
        <p class="text-sm leading-relaxed mb-8" style="color:#64748b">
          Centraliza, prioriza y resuelve cada incidencia de Epicor Kinetic con trazabilidad completa y estadísticas en tiempo real.
        </p>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3 mb-8">
          <div class="rounded-xl p-3 text-center" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06)">
            <p class="text-xl font-bold text-white">99%</p>
            <p class="text-xs mt-0.5" style="color:#475569">Uptime</p>
          </div>
          <div class="rounded-xl p-3 text-center" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06)">
            <p class="text-xl font-bold text-white">&lt;2h</p>
            <p class="text-xs mt-0.5" style="color:#475569">Respuesta</p>
          </div>
          <div class="rounded-xl p-3 text-center" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06)">
            <p class="text-xl font-bold text-white">IA</p>
            <p class="text-xs mt-0.5" style="color:#475569">Asistente</p>
          </div>
        </div>

        <!-- Features -->
        <div class="space-y-3">
          <div v-for="f in features" :key="f.text" class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              :style="`background:${f.color}22;border:1px solid ${f.color}44`">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" :stroke="f.color" stroke-width="2.5">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </div>
            <span class="text-sm" style="color:#94a3b8">{{ f.text }}</span>
          </div>
        </div>
      </div>

      <!-- Footer del panel -->
      <div class="relative flex items-center gap-2">
        <div class="flex -space-x-2">
          <div v-for="c in ['#6366f1','#10b981','#f59e0b']" :key="c"
            class="w-7 h-7 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold"
            :style="`background:${c}`">•</div>
        </div>
        <p class="text-xs" style="color:#475569">Equipo de soporte disponible</p>
      </div>
    </div>

    <!-- Right panel — formulario -->
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-[400px]">

        <!-- Mobile logo -->
        <div class="flex items-center gap-2.5 mb-8 lg:hidden">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center"
            style="background:linear-gradient(135deg,#6366f1,#8b5cf6)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <path d="M15 5H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
              <path d="M9 9h6M9 12h4"/>
            </svg>
          </div>
          <span class="text-lg font-bold" style="color:#1e293b">TicketSystem</span>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold mb-2" style="color:#0f172a">Bienvenido de vuelta</h1>
          <p class="text-sm" style="color:#64748b">Ingresa tus credenciales corporativas para continuar</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">

          <div>
            <label class="block text-sm font-semibold mb-1.5" style="color:#374151">
              Correo electrónico
            </label>
            <div class="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"
                class="absolute" style="left:14px;top:50%;transform:translateY(-50%)">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input v-model="form.email" type="email"
                class="w-full rounded-xl text-sm outline-none transition-all"
                style="padding:12px 14px 12px 42px;background:white;border:1.5px solid #e5e7eb;color:#111827"
                placeholder="usuario@empresa.com" required autocomplete="email"
                @focus="e=>e.target.style.borderColor='#6366f1'"
                @blur="e=>e.target.style.borderColor='#e5e7eb'" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1.5" style="color:#374151">
              Contraseña
            </label>
            <div class="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"
                class="absolute" style="left:14px;top:50%;transform:translateY(-50%)">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input v-model="form.password" :type="showPass ? 'text' : 'password'"
                class="w-full rounded-xl text-sm outline-none transition-all"
                style="padding:12px 42px 12px 42px;background:white;border:1.5px solid #e5e7eb;color:#111827"
                placeholder="••••••••" required autocomplete="current-password"
                @focus="e=>e.target.style.borderColor='#6366f1'"
                @blur="e=>e.target.style.borderColor='#e5e7eb'" />
              <button type="button" @click="showPass=!showPass"
                class="absolute" style="right:14px;top:50%;transform:translateY(-50%);color:#9ca3af">
                <svg v-if="!showPass" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
            style="background:#fef2f2;border:1px solid #fecaca;color:#dc2626">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <!-- Botón -->
          <button type="submit"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all"
            style="background:linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 4px 15px rgba(99,102,241,0.4)"
            :disabled="loading"
            onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 20px rgba(99,102,241,0.5)'"
            onmouseout="this.style.transform='none';this.style.boxShadow='0 4px 15px rgba(99,102,241,0.4)'">
            <svg v-if="loading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
              style="animation:spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ loading ? 'Verificando...' : 'Iniciar sesión' }}
            <svg v-if="!loading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
            </svg>
          </button>
        </form>

        <p class="text-center text-xs mt-6" style="color:#94a3b8">
          Acceso exclusivo para usuarios autorizados<br>
          <span style="color:#cbd5e1">© 2026 TicketSystem · Epicor Kinetic</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
input::placeholder { color: #d1d5db !important; }
</style>

<script setup>
definePageMeta({ layout: false })
import { useAuthStore } from '~/stores/auth'

const auth     = useAuthStore()
const form     = reactive({ email: '', password: '' })
const error    = ref('')
const loading  = ref(false)
const showPass = ref(false)

const features = [
  { text: 'Categorías específicas de Epicor Kinetic', color: '#6366f1' },
  { text: 'Trazabilidad completa con comentarios',    color: '#10b981' },
  { text: 'Dashboard con estadísticas en tiempo real', color: '#f59e0b' },
  { text: 'Asistente IA para soporte rápido',          color: '#ec4899' },
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
