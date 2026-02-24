<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="text-xl font-semibold" style="color: var(--text)">Usuarios</h1>
        <p class="text-sm mt-0.5" style="color: var(--muted)">Gestión de cuentas del sistema</p>
      </div>
      <button @click="openCreate" class="btn-primary">+ Nuevo Usuario</button>
    </div>

    <!-- TABLA -->
    <div class="card p-0 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr style="border-bottom: 1px solid var(--border); background: var(--surface2)">
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color: var(--muted)">Nombre</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color: var(--muted)">Email</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color: var(--muted)">Rol</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color: var(--muted)">Registro</th>
            <th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color: var(--muted)">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id"
            style="border-bottom: 1px solid var(--border)"
            class="transition-colors duration-150 hover:bg-[var(--surface2)]">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                  style="background: var(--accent)">
                  {{ user.name?.charAt(0) }}
                </div>
                <span class="text-sm font-medium" style="color: var(--text)">{{ user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-sm" style="color: var(--muted)">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span class="badge" :class="{
                'bg-blue-100 text-blue-700': user.role === 'ADMIN',
                'bg-green-100 text-green-700': user.role === 'AGENT',
                'bg-orange-100 text-orange-700': user.role === 'USER'
              }">{{ user.role }}</span>
            </td>
            <td class="px-4 py-3 text-sm font-mono" style="color: var(--muted)">
              {{ new Date(user.createdAt).toLocaleDateString('es-MX') }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button @click="openEdit(user)" class="text-xs px-3 py-1.5 rounded-md transition-colors"
                  style="border: 1px solid var(--border); color: var(--muted)"
                  onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--muted)'">
                  Editar
                </button>
                <button @click="confirmDelete(user)" class="text-xs px-3 py-1.5 rounded-md transition-colors"
                  style="border: 1px solid #fecaca; color: #dc2626; background: #fef2f2"
                  onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fef2f2'">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL CREAR / EDITAR -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.5)" @click.self="closeModal">
      <div class="w-full max-w-md rounded-xl p-6" style="background: var(--surface); border: 1px solid var(--border)">
        <h2 class="text-base font-semibold mb-4" style="color: var(--text)">
          {{ editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Nombre completo</label>
            <input v-model="form.name" class="input" placeholder="Juan Pérez" required />
          </div>
          <div>
            <label class="label">Correo electrónico</label>
            <input v-model="form.email" type="email" class="input" placeholder="correo@empresa.com" required />
          </div>
          <div>
            <label class="label">
              {{ editingUser ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña' }}
            </label>
            <input v-model="form.password" type="password" class="input" placeholder="••••••••"
              :required="!editingUser" />
          </div>
          <div>
            <label class="label">Rol</label>
            <select v-model="form.role" class="input" required>
              <option value="USER">USER — Solo reportar tickets</option>
              <option value="AGENT">AGENT — Atender tickets</option>
              <option value="ADMIN">ADMIN — Acceso total</option>
            </select>
          </div>

          <div v-if="error" class="rounded-md px-3 py-2 text-xs"
            style="background: #fef2f2; color: var(--danger); border: 1px solid #fecaca">
            {{ error }}
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Guardando...' : (editingUser ? 'Guardar cambios' : 'Crear Usuario') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL CONFIRMAR ELIMINAR -->
    <div v-if="showDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.5)" @click.self="showDelete = false">
      <div class="w-full max-w-sm rounded-xl p-6" style="background: var(--surface); border: 1px solid var(--border)">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style="background: #fef2f2">
            <span style="color: #dc2626; font-size: 18px">⚠</span>
          </div>
          <div>
            <h2 class="text-sm font-semibold" style="color: var(--text)">Eliminar usuario</h2>
            <p class="text-xs" style="color: var(--muted)">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p class="text-sm mb-4" style="color: var(--muted)">
          ¿Estás seguro que deseas eliminar a <strong style="color: var(--text)">{{ deletingUser?.name }}</strong>?
        </p>
        <div v-if="error" class="rounded-md px-3 py-2 text-xs mb-3"
          style="background: #fef2f2; color: #dc2626; border: 1px solid #fecaca">
          {{ error }}
        </div>
        <div class="flex justify-end gap-2">
          <button @click="showDelete = false" class="btn-secondary">Cancelar</button>
          <button @click="handleDelete" class="btn-primary" :disabled="loading"
            style="background: #dc2626" onmouseover="this.style.background='#b91c1c'" onmouseout="this.style.background='#dc2626'">
            {{ loading ? 'Eliminando...' : 'Sí, eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
const auth = useAuthStore()

const users = ref([])
const showModal = ref(false)
const showDelete = ref(false)
const editingUser = ref(null)
const deletingUser = ref(null)
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '', role: 'USER' })

async function fetchUsers() {
  users.value = await $fetch('/api/users')
}

function openCreate() {
  editingUser.value = null
  form.name = ''; form.email = ''; form.password = ''; form.role = 'USER'
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
    if (editingUser.value) {
      // EDITAR
      const body = { name: form.name, email: form.email, role: form.role }
      if (form.password) body.password = form.password
      await $fetch(`/api/users/${editingUser.value.id}`, { method: 'PATCH', body })
    } else {
      // CREAR
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name: form.name, email: form.email, password: form.password, role: form.role }
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
    await $fetch(`/api/users/${deletingUser.value.id}`, { method: 'DELETE' })
    await fetchUsers()
    showDelete.value = false
  } catch (e) {
    error.value = e?.data?.message || 'Error al eliminar'
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>