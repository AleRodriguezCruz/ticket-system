<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">Usuarios</h1>
        <p class="text-xs mt-0.5" style="color:var(--muted)">{{ users.length }} cuentas registradas en el sistema</p>
      </div>
      <button @click="openCreate" class="btn-primary">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Nuevo Usuario
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <svg class="animate-spin h-8 w-8" style="color:var(--accent)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else class="table-container">
      <table class="w-full">
        <thead>
          <tr style="background:var(--surface2);border-bottom:1px solid var(--border-soft)">
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Usuario</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">Correo</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:120px">Rol</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:130px">Registro</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style="color:var(--muted);width:120px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="table-row" style="cursor:default">
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
                  {{ user.name?.charAt(0)?.toUpperCase() }}
                </div>
                <span class="text-sm font-medium" style="color:var(--text)">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3.5 text-sm" style="color:var(--muted)">{{ user.email }}</td>
            <td class="px-4 py-3.5">
              <span class="badge" :style="roleBadge(user.role)">{{ getRoleLabel(user.role) }}</span>
            </td>
            <td class="px-4 py-3.5 text-xs font-mono" style="color:var(--muted-2)">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center gap-1.5">
                <button @click="openEdit(user)" class="btn-ghost text-xs">Editar</button>
                <button @click="confirmDelete(user)" class="btn-ghost text-xs" style="color:var(--danger)"
                  onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!users.length">
            <td colspan="5" class="px-4 py-12 text-center">
              <div class="empty-state">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <p class="text-sm" style="color:var(--muted)">No hay usuarios registrados</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal crear/editar (igual que antes) -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-base font-semibold" style="color:var(--text)">
            {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h2>
          <button @click="closeModal" class="btn-ghost p-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="field">
            <label class="label">Nombre completo</label>
            <input v-model="form.name" class="input" placeholder="Juan Pérez" required />
          </div>
          <div class="field">
            <label class="label">Correo electrónico</label>
            <input v-model="form.email" type="email" class="input" placeholder="correo@empresa.com" required :disabled="!!editingUser" />
          </div>
          <div class="field">
            <label class="label">{{ editingUser ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña' }}</label>
            <input v-model="form.password" type="password" class="input" placeholder="••••••••" :required="!editingUser" />
          </div>
          <div class="field">
            <label class="label">Rol</label>
            <select v-model="form.role" class="input" required>
              <option value="USER">USER — Solo reportar tickets</option>
              <option value="AGENT">AGENT — Atender tickets</option>
              <option value="ADMIN">ADMIN — Acceso total</option>
            </select>
          </div>
          <div v-if="error" class="alert-error">{{ error }}</div>
          <div class="flex justify-end gap-2 pt-1">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingUser ? 'Guardar cambios' : 'Crear Usuario') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal eliminar -->
    <div v-if="showDelete" class="modal-overlay" @click.self="showDelete = false">
      <div class="modal-box w-full max-w-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style="background:#fef2f2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold" style="color:var(--text)">Eliminar usuario</h2>
            <p class="text-xs" style="color:var(--muted)">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p class="text-sm mb-4" style="color:var(--muted)">
          ¿Eliminar a <strong style="color:var(--text)">{{ deletingUser?.name }}</strong>?
        </p>
        <div v-if="error" class="alert-error mb-3">{{ error }}</div>
        <div class="flex justify-end gap-2">
          <button @click="showDelete = false" class="btn-secondary">Cancelar</button>
          <button @click="handleDelete" class="btn-primary" :disabled="loading"
            style="background:#dc2626" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
            {{ loading ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const { token, isAdmin } = storeToRefs(authStore)
const router = useRouter()

// Redirigir si no es ADMIN
if (!isAdmin.value) {
  router.push('/dashboard')
}

const users = ref([])
const showModal = ref(false)
const showDelete = ref(false)
const editingUser = ref(null)
const deletingUser = ref(null)
const loading = ref(false)
const error = ref('')
const form = reactive({ 
  name: '', 
  email: '', 
  password: '', 
  role: 'USER' 
})

// Función para obtener el label del rol en español
function getRoleLabel(role) {
  const labels = {
    ADMIN: 'Administrador',
    AGENT: 'Agente',
    USER: 'Usuario'
  }
  return labels[role] || role
}

function roleBadge(role) {
  const map = {
    ADMIN: 'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe',
    AGENT: 'background:#f0fdf4;color:#166534;border:1px solid #bbf7d0',
    USER: 'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa'
  }
  return map[role] || ''
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-MX')
}

async function fetchUsers() {
  loading.value = true
  try {
    const data = await $fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    users.value = data || []
    console.log('✅ Usuarios cargados:', users.value.length)
  } catch (err) {
    console.error('❌ Error fetching users:', err)
    if (err.status === 401) {
      authStore.logout()
    }
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingUser.value = null
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = 'USER'
  error.value = ''
  showModal.value = true
}

function openEdit(user) {
  editingUser.value = user
  form.name = user.name
  form.email = user.email
  form.password = ''
  form.role = user.role
  error.value = ''
  showModal.value = true
}

function confirmDelete(user) {
  deletingUser.value = user
  error.value = ''
  showDelete.value = true
}

function closeModal() {
  showModal.value = false
  editingUser.value = null
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    const headers = { 'Authorization': `Bearer ${token.value}` }
    
    if (editingUser.value) {
      const body = { name: form.name, role: form.role }
      if (form.password) body.password = form.password
      await $fetch(`/api/users/${editingUser.value.id}`, {
        method: 'PATCH',
        body,
        headers
      })
    } else {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        },
        headers
      })
    }
    await fetchUsers()
    closeModal()
  } catch (e) {
    error.value = e?.data?.message || 'Error al guardar'
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  loading.value = true
  error.value = ''
  try {
    await $fetch(`/api/users/${deletingUser.value.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    await fetchUsers()
    showDelete.value = false
  } catch (e) {
    error.value = e?.data?.message || 'Error al eliminar'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>
