<template>
  <div class="min-h-screen flex items-center justify-center" style="background: var(--bg)">

    <!-- Grid background -->
    <div class="fixed inset-0 opacity-5" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 40px 40px;"></div>

    <div class="relative w-full max-w-sm">

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl text-black font-bold text-lg mb-4" style="background: var(--accent)">T</div>
        <h1 class="text-xl font-semibold" style="color: var(--text)">TicketSystem</h1>
        <p class="text-sm mt-1" style="color: var(--muted)">Acceso al panel de administración</p>
      </div>

      <!-- Form -->
      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label">Correo electrónico</label>
            <input v-model="form.email" type="email" class="input" placeholder="admin@empresa.com" required />
          </div>
          <div>
            <label class="label">Contraseña</label>
            <input v-model="form.password" type="password" class="input" placeholder="••••••••" required />
          </div>

          <div v-if="error" class="rounded-lg px-3 py-2 text-xs" style="background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2)">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Verificando...' : 'Ingresar' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs mt-6" style="color: var(--muted)">
        Solo usuarios autorizados
      </p>
    </div>
  </div>
</template>

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