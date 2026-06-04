<script setup>
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const { token, user, isAdmin } = storeToRefs(authStore)

// Redirigir si no es ADMIN
if (!isAdmin.value) {
  navigateTo('/dashboard')
}

const users = ref([])
const showModal = ref(false)
const showDelete = ref(false)
const editingUser = ref(null)
const deletingUser = ref(null)
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '', role: 'USER' })

// ⭐ Función para formatear fecha
function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('es-MX')
}

// ⭐ Fetch users CON token
async function fetchUsers() {
  loading.value = true
  try {
    const data = await $fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    users.value = data || []
  } catch (err) {
    console.error('Error fetching users:', err)
    if (err.status === 401) {
      authStore.logout()
    }
  } finally {
    loading.value = false
  }
}

// ⭐ El resto de tus funciones (roleBadge, openCreate, openEdit, etc.)
// se mantienen igual, solo asegúrate de agregar el token en las peticiones

function roleBadge(role) {
  const map = {
    ADMIN: 'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe',
    AGENT: 'background:#f0fdf4;color:#166534;border:1px solid #bbf7d0',
    USER:  'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa'
  }
  return map[role] || ''
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
