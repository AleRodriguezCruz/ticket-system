<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">👥 Usuarios</h1>
      <button @click="mostrarForm = true" class="btn-primary">+ Nuevo Usuario</button>
    </div>

    <div class="card mb-6">
      <table class="w-full text-sm">
        <thead class="text-gray-400 uppercase text-xs border-b">
          <tr>
            <th class="pb-3 text-left">Nombre</th>
            <th class="pb-3 text-left">Email</th>
            <th class="pb-3 text-left">Rol</th>
            <th class="pb-3 text-left">Registro</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="py-3 font-medium">{{ user.name }}</td>
            <td class="py-3 text-gray-500">{{ user.email }}</td>
            <td class="py-3">
              <span :class="rolStyles[user.role]" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ user.role }}
              </span>
            </td>
            <td class="py-3 text-gray-400">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-bold mb-4">Nuevo Usuario</h2>
        <form @submit.prevent="crearUsuario" class="space-y-4">
          <div>
            <label class="label">Nombre</label>
            <input v-model="form.name" class="input" required />
          </div>
          <div>
            <label class="label">Email</label>
            <input v-model="form.email" type="email" class="input" required />
          </div>
          <div>
            <label class="label">Contraseña</label>
            <input v-model="form.password" type="password" class="input" required />
          </div>
          <div>
            <label class="label">Rol</label>
            <select v-model="form.role" class="input">
              <option value="USER">Usuario</option>
              <option value="AGENT">Agente</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="mostrarForm = false" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Creando...' : 'Crear Usuario' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: users, refresh } = await useFetch('/api/users')
const mostrarForm = ref(false)
const loading     = ref(false)
const error       = ref('')
const form        = reactive({ name: '', email: '', password: '', role: 'AGENT' })

const rolStyles = {
  ADMIN: 'bg-indigo-100 text-indigo-700',
  AGENT: 'bg-blue-100 text-blue-600',
  USER:  'bg-gray-100 text-gray-600'
}

async function crearUsuario() {
  loading.value = true
  error.value   = ''
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: form })
    await refresh()
    mostrarForm.value = false
    Object.assign(form, { name: '', email: '', password: '', role: 'AGENT' })
  } catch (e) {
    error.value = e?.data?.message || 'Error al crear usuario'
  } finally {
    loading.value = false
  }
}
</script>