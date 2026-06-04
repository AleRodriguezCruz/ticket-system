<script setup>
// ⭐ IMPORTANTE: Deshabilitar SSR para evitar error de localStorage
definePageMeta({
  middleware: 'auth',
  ssr: false
})

import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { token, isAdmin, user } = storeToRefs(authStore)
const router = useRouter()

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

function getRoleLabel(role) {
  const labels = { ADMIN: 'Administrador', AGENT: 'Agente', USER: 'Usuario' }
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
  if (!process.client) return
  
  loading.value = true
  error.value = ''
  
  // ⭐ Obtener token directamente de localStorage si store está vacío
  let authToken = token.value;
  if (!authToken) {
    authToken = localStorage.getItem('token');
    console.log('⚠️ Token recuperado de localStorage directamente');
  }
  
  if (!authToken) {
    console.error('❌ No hay token de autenticación');
    error.value = 'No hay sesión activa. Por favor inicia sesión nuevamente.';
    loading.value = false;
    return;
  }
  
  console.log('🔑 Token usado:', authToken.substring(0, 50) + '...');
  
  try {
    const response = await $fetch('/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    })
    users.value = response || []
    console.log('✅ Usuarios cargados:', users.value.length);
    console.table(users.value.map(u => ({ name: u.name, email: u.email, role: u.role })));
  } catch (err) {
    console.error('❌ Error fetching users:', err)
    error.value = err?.data?.message || err?.message || 'Error al cargar usuarios'
    
    if (err?.status === 401) {
      alert('Sesión expirada. Redirigiendo al login...');
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
    let authToken = token.value;
    if (!authToken) {
      authToken = localStorage.getItem('token');
    }
    const headers = { 'Authorization': `Bearer ${authToken}` }
    
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
    let authToken = token.value;
    if (!authToken) {
      authToken = localStorage.getItem('token');
    }
    await $fetch(`/api/users/${deletingUser.value.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
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
  if (process.client) {
    // ⭐ Asegurar que el store tenga la sesión cargada
    authStore.loadFromStorage();
    
    setTimeout(() => {
      console.log('👤 Usuario en store:', authStore.user);
      console.log('👑 isAdmin:', authStore.isAdmin);
      console.log('🔑 Token existe:', !!authStore.token);
      fetchUsers()
    }, 100);
  }
})
</script>
