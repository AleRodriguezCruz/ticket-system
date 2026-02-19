<template>
  <div class="min-h-screen bg-indigo-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

      <h2 class="text-2xl font-bold text-center text-indigo-600 mb-6">🎫 TicketSystem</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="label">Correo electrónico</label>
          <input v-model="form.email" type="email" class="input" placeholder="correo@empresa.com" required />
        </div>
        <div>
          <label class="label">Contraseña</label>
          <input v-model="form.password" type="password" class="input" placeholder="••••••••" required />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button type="submit" class="btn-primary w-full" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

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
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form
    })
    auth.setAuth(res.user, res.token)
    navigateTo('/')
  } catch (e) {
    error.value = e?.data?.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>