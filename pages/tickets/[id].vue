<template>
  <div class="max-w-3xl mx-auto" v-if="ticket">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="navigateTo('/tickets')" class="btn-ghost">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
        Volver
      </button>
      <div class="w-px h-4" style="background:var(--border)"></div>
      <span class="text-sm font-mono font-medium" style="color:var(--muted)">Ticket #{{ ticket.id }}</span>
      <StatusBadge :status="ticket.status" />
      <PriorityBadge :priority="ticket.priority" />
      <button v-if="auth.isAdmin" @click="showDelete = true"
        class="ml-auto btn-ghost text-xs" style="color:#dc2626"
        onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2 2 0 0 1-2,2H7a2 2 0 0 1-2-2V6m3,0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2,2v2"/>
        </svg>
        Eliminar
      </button>
    </div>

    <div class="space-y-4">

      <!-- Ticket info -->
      <div class="card">
        <div class="flex items-start justify-between gap-4 mb-4">
          <h2 class="text-lg font-semibold tracking-tight leading-snug" style="color:var(--text)">{{ ticket.title }}</h2>
          <span class="text-xs px-2 py-1 rounded-md font-medium flex-shrink-0" style="background:var(--surface3);color:var(--muted)">
            {{ ticket.category }}
          </span>
        </div>

        <div class="flex items-center gap-3 mb-4 pb-4" style="border-bottom:1px solid var(--border-soft)">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
            {{ ticket.createdBy?.name?.charAt(0) }}
          </div>
          <div>
            <span class="text-xs font-medium" style="color:var(--text)">{{ ticket.createdBy?.name }}</span>
            <span class="text-xs ml-2" style="color:var(--muted)">
              {{ new Date(ticket.createdAt).toLocaleDateString('es-MX', { day:'numeric', month:'long', year:'numeric' }) }}
            </span>
          </div>
        </div>

        <!-- Descripción -->
        <p class="text-sm leading-relaxed whitespace-pre-wrap mb-4" style="color:var(--text-2)">{{ ticket.description }}</p>

        <!-- Adjuntos -->
        <div v-if="ticket.attachments?.length" class="pt-4" style="border-top:1px solid var(--border-soft)">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:var(--muted)">
            Imágenes adjuntas ({{ ticket.attachments.length }})
          </p>
          <div class="flex flex-wrap gap-2">
            
              v-for="att in ticket.attachments"
              :key="att.id"
              :href="att.url"
              target="_blank"
              rel="noopener"
            >
              <img
                :src="att.url"
                :alt="att.filename"
                class="w-24 h-24 object-cover rounded-lg cursor-pointer transition-opacity"
                style="border:1px solid var(--border)"
                onmouseover="this.style.opacity='0.75'"
                onmouseout="this.style.opacity='1'"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Solución si existe -->
      <div v-if="ticket.solution" class="card" style="border-color:#bbf7d0;background:#f0fdf4">
        <div class="flex items-center gap-2 mb-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          <h3 class="text-sm font-semibold" style="color:#059669">Solución aplicada</h3>
          <span v-if="ticket.closedAt" class="text-xs ml-auto" style="color:#34d399">
            Cerrado {{ new Date(ticket.closedAt).toLocaleDateString('es-MX') }}
          </span>
        </div>
        <p class="text-sm whitespace-pre-wrap leading-relaxed" style="color:#166534">{{ ticket.solution }}</p>
      </div>

      <!-- Gestión (solo admin) -->
      <div class="card space-y-4" v-if="auth.isAdmin">
        <div class="flex items-center gap-2 pb-3" style="border-bottom:1px solid var(--border-soft)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted)">
            <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
          </svg>
          <h3 class="text-sm font-semibold" style="color:var(--text)">Gestión del Ticket</h3>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="field">
            <label class="label">Estado</label>
            <select v-model="gestion.status" class="input">
              <option value="OPEN">Abierto</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="CLOSED">Cerrado</option>
            </select>
          </div>
          <div class="field">
            <label class="label">Prioridad</label>
            <select v-model="gestion.priority" class="input">
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label class="label">Asignar a</label>
          <select v-model="gestion.assignedToId" class="input">
            <option :value="null">Sin asignar</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} · {{ user.role }}
            </option>
          </select>
        </div>
        <div v-if="gestion.status === 'CLOSED'" class="field">
          <label class="label">Solución aplicada <span style="color:var(--danger)">*</span></label>
          <textarea v-model="gestion.solution" class="input resize-none" style="height:110px"
            placeholder="Describe cómo se resolvió el problema. Esta información quedará en la base de conocimiento." />
        </div>

        <div v-if="saveSuccess" class="alert-success flex items-center gap-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          Cambios guardados correctamente
        </div>

        <div class="flex justify-end">
          <button @click="actualizarTicket" class="btn-primary" :disabled="guardando">
            <svg v-if="guardando" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>

      <!-- Comentarios -->
      <div class="card">
        <div class="flex items-center gap-2 mb-4 pb-3" style="border-bottom:1px solid var(--border-soft)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted)">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <h3 class="text-sm font-semibold" style="color:var(--text)">Comentarios</h3>
          <span class="text-xs px-1.5 py-0.5 rounded-full font-semibold" style="background:var(--surface3);color:var(--muted)">
            {{ comments?.length || 0 }}
          </span>
        </div>

        <!-- Lista de comentarios -->
        <div class="space-y-4 mb-4" v-if="comments?.length">
          <div v-for="comment in comments" :key="comment.id" class="flex gap-3 group">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">
              {{ comment.author?.charAt(0)?.toUpperCase() }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold" style="color:var(--text)">{{ comment.author }}</span>
                <span class="text-xs" style="color:var(--muted-2)">
                  {{ new Date(comment.createdAt).toLocaleDateString('es-MX', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) }}
                </span>
                <button v-if="auth.isAdmin" @click="deleteComment(comment.id)"
                  class="ml-auto opacity-0 group-hover:opacity-100 btn-ghost p-1 transition-opacity" style="color:var(--danger)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2 2 0 0 1-2,2H7a2 2 0 0 1-2-2V6"/>
                  </svg>
                </button>
              </div>
              <div class="rounded-lg px-3 py-2.5 text-sm leading-relaxed" style="background:var(--surface2);color:var(--text-2)">
                {{ comment.text }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-6" style="color:var(--muted-2)">
          <p class="text-sm">Sin comentarios aún</p>
        </div>

        <!-- Nuevo comentario -->
        <div class="flex gap-3 pt-3" style="border-top:1px solid var(--border-soft)">
          <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style="background:linear-gradient(135deg,#1a56db,#3b82f6)">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="flex-1">
            <textarea v-model="newComment" class="input resize-none" style="height:70px"
              placeholder="Agregar un comentario o actualización..." />
            <div class="flex justify-end mt-2">
              <button @click="addComment" class="btn-primary" :disabled="!newComment.trim() || addingComment">
                {{ addingComment ? 'Publicando...' : 'Comentar' }}
              </button>
            </div>
          </div>
        </div>
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
            <h2 class="text-sm font-semibold" style="color:var(--text)">Eliminar ticket</h2>
            <p class="text-xs" style="color:var(--muted)">Esta acción no se puede deshacer</p>
          </div>
        </div>
        <p class="text-sm mb-4" style="color:var(--muted)">
          ¿Eliminar <strong style="color:var(--text)">#{{ ticket.id }} — {{ ticket.title }}</strong>?
        </p>
        <div v-if="deleteError" class="alert-error mb-3">{{ deleteError }}</div>
        <div class="flex justify-end gap-2">
          <button @click="showDelete = false" class="btn-secondary">Cancelar</button>
          <button @click="eliminarTicket" class="btn-primary" :disabled="eliminando"
            style="background:#dc2626"
            onmouseover="this.style.background='#b91c1c'"
            onmouseout="this.style.background='#dc2626'">
            {{ eliminando ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else class="flex items-center justify-center h-64">
    <div class="flex items-center gap-3" style="color:var(--muted)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Cargando ticket...
    </div>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<script setup>
import { useAuthStore } from '~/stores/auth'

const auth  = useAuthStore()
const route = useRoute()

// Redirigir si no está autenticado
if (!auth.isLoggedIn) navigateTo('/login')

const guardando     = ref(false)
const saveSuccess   = ref(false)
const showDelete    = ref(false)
const eliminando    = ref(false)
const deleteError   = ref('')
const newComment    = ref('')
const addingComment = ref(false)

// Headers con token para todas las peticiones
const authHeaders = computed(() => ({
  Authorization: `Bearer ${auth.token}`
}))

// Carga inicial — incluye adjuntos en el include del backend
const { data: ticket, refresh } = await useFetch(
  `/api/tickets/${route.params.id}`,
  { headers: authHeaders }
)

const { data: users } = await useFetch(
  '/api/users',
  { headers: authHeaders }
)

const { data: comments, refresh: refreshComments } = await useFetch(
  `/api/tickets/${route.params.id}/comments`,
  { headers: authHeaders }
)

const gestion = reactive({
  status:       ticket.value?.status       || 'OPEN',
  priority:     ticket.value?.priority     || 'MEDIUM',
  assignedToId: ticket.value?.assignedToId || null,
  solution:     ticket.value?.solution     || ''
})

async function actualizarTicket() {
  if (gestion.status === 'CLOSED' && !gestion.solution.trim()) {
    alert('Por favor agrega la solución antes de cerrar el ticket')
    return
  }
  guardando.value = true
  try {
    await $fetch(`/api/tickets/${route.params.id}`, {
      method:  'PATCH',
      body:    gestion,
      headers: authHeaders.value
    })
    await refresh()
    saveSuccess.value = true
    setTimeout(() => saveSuccess.value = false, 3000)
  } catch (e) {
    alert(e?.data?.message || 'Error al actualizar el ticket')
  } finally {
    guardando.value = false
  }
}

async function addComment() {
  if (!newComment.value.trim()) return
  addingComment.value = true
  try {
    await $fetch(`/api/tickets/${route.params.id}/comments`, {
      method:  'POST',
      body:    { text: newComment.value, author: auth.user?.name },
      headers: authHeaders.value
    })
    newComment.value = ''
    await refreshComments()
  } catch (e) {
    alert('Error al agregar comentario')
  } finally {
    addingComment.value = false
  }
}

async function deleteComment(commentId) {
  try {
    await $fetch(`/api/tickets/${route.params.id}/comments/${commentId}`, {
      method:  'DELETE',
      headers: authHeaders.value
    })
    await refreshComments()
  } catch {}
}

async function eliminarTicket() {
  eliminando.value  = true
  deleteError.value = ''
  try {
    await $fetch(`/api/tickets/${route.params.id}`, {
      method:  'DELETE',
      headers: authHeaders.value
    })
    navigateTo('/tickets')
  } catch (e) {
    deleteError.value = e?.data?.message || 'Error al eliminar el ticket'
  } finally {
    eliminando.value = false
  }
}
</script>
