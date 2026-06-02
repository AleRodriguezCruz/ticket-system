<template>
  <div class="min-h-screen flex items-center justify-center" style="background:#0c1520">

    <!-- Background pattern -->
    <div class="fixed inset-0" style="background-image:radial-gradient(circle at 25% 25%, rgba(26,86,219,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.05) 0%, transparent 50%)"></div>
    <div class="fixed inset-0 opacity-[0.03]" style="background-image:linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px);background-size:40px 40px"></div>

    <div class="relative w-full max-w-sm px-4">

      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style="background:linear-gradient(135deg,#1a56db,#3b82f6);box-shadow:0 8px 24px rgba(26,86,219,0.35)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-semibold text-white tracking-tight">TicketSystem</h1>
        <p class="text-sm mt-1.5" style="color:#4d6b8a">Epicor Kinetic · Soporte Interno</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl p-7" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(12px)">
        <h2 class="text-base font-semibold text-white mb-1">Iniciar sesión</h2>
        <p class="text-xs mb-5" style="color:#4d6b8a">Ingresa tus credenciales de acceso</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label" style="color:#5a7a9a">Correo electrónico</label>
            <input v-model="form.email" type="email"
              style="background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.1);color:white"
              class="input" placeholder="usuario@empresa.com" required />
          </div>
          <div>
            <label class="label" style="color:#5a7a9a">Contraseña</label>
            <input v-model="form.password" type="password"
              style="background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.1);color:white"
              class="input" placeholder="••••••••" required />
          </div>

          <div v-if="error" class="rounded-lg px-3 py-2 text-xs"
            style="background:rgba(220,38,38,0.12);color:#f87171;border:1px solid rgba(220,38,38,0.2)">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full justify-center mt-1" :disabled="loading">
            <svg v-if="loading" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ loading ? 'Verificando...' : 'Ingresar al sistema' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs mt-5" style="color:#2d4560">Solo usuarios autorizados · Acceso monitoreado</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
input::placeholder { color: #3d5570 !important; }
input:focus { border-color: #1a56db !important; box-shadow: 0 0 0 3px rgba(26,86,219,0.2) !important; }
</style>

<script setup>
definePageMeta({ layout: false })
import { useAuthStore } from '~/stores/auth'
const auth    = useAuthStore()
const form    = reactive({ email: '', password: '' })
const error   = ref('')
const loading = ref(false)

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
