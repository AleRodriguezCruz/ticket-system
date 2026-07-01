<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="flex items-center gap-3" style="color:var(--muted)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Cargando...
      </div>
    </div>

    <template v-else>
      <!-- ADMIN / AGENT VIEW -->
      <template v-if="isAdminOrAgent">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h1 class="text-xl font-semibold tracking-tight" style="color:var(--text)">
              Buenos días, {{ firstName }} 👋
            </h1>
            <p class="text-xs mt-1" style="color:var(--muted)">Resumen del sistema al día de hoy</p>
          </div>
          <NuxtLink to="/tickets/new" class="btn-primary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nueva Incidencia
          </NuxtLink>
        </div>

        <div class="grid grid-cols-4 gap-3 mb-5">
          <div class="card" v-for="s in stats" :key="s.label">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold uppercase tracking-wider" style="color:var(--muted)">{{ s.label }}</span>
              <div class="w-7 h-7 rounded-lg flex items-center justify-center" :style="`background:${s.bg}`">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" :stroke="s.color" stroke-width="2" v-html="s.icon"></svg>
              </div>
            </div>
            <div class="text-3xl font-bold mb-0.5" :style="`color:${s.color}`">{{ s.value }}</div>
            <div class="text-xs" style="color:var(--muted-2)">{{ s.sub }}</div>
          </div>
        </div>

        <div class="grid grid-cols-5 gap-4 mb-4">
          <div class="card col-span-2">
            <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Por Estado</p>
            <div class="flex items-center gap-5">
              <svg width="100" height="100" viewBox="0 0 100 100" class="flex-shrink-0">
                <circle cx="50" cy="50" r="36" fill="none" stroke="var(--surface3)" stroke-width="14"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#059669" stroke-width="14"
                  :stroke-dasharray="`${openPct * 2.262} 226.2`" stroke-dashoffset="56.5"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#d97706" stroke-width="14"
                  :stroke-dasharray="`${inPct * 2.262} 226.2`"
                  :stroke-dashoffset="`${56.5 - openPct * 2.262}`"/>
                <text x="50" y="46" text-anchor="middle" font-size="17" font-weight="700" fill="var(--text)">{{ total }}</text>
                <text x="50" y="58" text-anchor="middle" font-size="8" fill="var(--muted-2)">total</text>
              </svg>
              <div class="space-y-2.5 flex-1">
                <div v-for="s in statusLegend" :key="s.label" class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full" :style="`background:${s.color}`"></div>
                    <span class="text-xs" style="color:var(--muted)">{{ s.label }}</span>
                  </div>
                  <span class="text-xs font-semibold" style="color:var(--text)">{{ s.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card col-span-3">
            <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Por Categoría</p>
            <div class="space-y-2.5">
              <div v-for="c in topCategories" :key="c.name">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs truncate" style="color:var(--text-2);max-width:200px">{{ c.name }}</span>
                  <span class="text-xs font-semibold ml-3" style="color:var(--text)">{{ c.count }}</span>
                </div>
                <div class="h-1.5 rounded-full" style="background:var(--surface3)">
                  <div class="h-full rounded-full" style="background:linear-gradient(90deg,#1a56db,#60a5fa)"
                    :style="{ width: `${Math.max((c.count / maxCat) * 100, 4)}%` }"></div>
                </div>
              </div>
              <div v-if="!topCategories.length" class="text-xs text-center py-4" style="color:var(--muted-2)">Sin datos aún</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-5 gap-4">
          <div class="card col-span-2">
            <p class="text-xs font-semibold uppercase tracking-wider mb-4" style="color:var(--muted)">Por Prioridad</p>
            <div class="space-y-3">
              <div v-for="p in priorityStats" :key="p.key">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs px-2 py-0.5 rounded font-medium" :style="p.badgeStyle">{{ p.label }}</span>
                  <span class="text-xs font-semibold" style="color:var(--text)">{{ p.count }}</span>
                </div>
                <div class="h-1.5 rounded-full" style="background:var(--surface3)">
                  <div class="h-full rounded-full"
                    :style="{ width: `${total ? Math.max((p.count/total)*100, p.count?4:0) : 0}%`, background: p.color }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="card col-span-3 p-0" style="overflow:hidden">
            <div class="flex items-center justify-between px-4 py-3" style="border-bottom:1px solid var(--border-soft)">
              <p class="text-sm font-semibold" style="color:var(--text)">Recientes</p>
              <NuxtLink to="/tickets" class="text-xs font-medium" style="color:var(--accent)">Ver todos →</NuxtLink>
            </div>
            <div>
              <div v-for="t in recentTickets" :key="t.id"
                class="flex items-center gap-3 px-4 py-3 cursor-pointer"
                style="border-bottom:1px solid var(--border-soft)"
                onmouseover="this.style.background='var(--surface2)'"
                onmouseout="this.style.background='transparent'"
                @click="navigateTo(`/tickets/${t.id}`)">
                <span class="text-xs font-mono flex-shrink-0" style="color:var(--muted-2);width:32px">#{{ t.id }}</span>
                <span class="text-sm flex-1 truncate font-medium" style="color:var(--text)">{{ t.title }}</span>
                <StatusBadge :status="t.status" />
                <PriorityBadge :priority="t.priority" />
              </div>
              <div v-if="!recentTickets.length" class="text-center py-8 text-sm" style="color:var(--muted-2)">
                Sin incidencias aún
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ===================== USER VIEW ===================== -->
      <template v-else>

        <!-- Hero de bienvenida -->
        <div class="rounded-2xl p-6 mb-6 relative overflow-hidden"
          style="background:linear-gradient(135deg,#1a56db 0%,#7c3aed 50%,#db2777 100%)">
          <div class="absolute inset-0 opacity-10"
            style="background-image:radial-gradient(circle at 20% 50%,white 1px,transparent 1px),radial-gradient(circle at 80% 20%,white 1px,transparent 1px);background-size:30px 30px"></div>
          <div class="relative flex items-center justify-between">
            <div>
              <p class="text-white/70 text-sm mb-1">¡Bienvenido de vuelta!</p>
              <h1 class="text-2xl font-bold text-white mb-1">Hola, {{ firstName }} 👋</h1>
              <p class="text-white/60 text-xs">Sistema de Soporte · Epicor Kinetic</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <NuxtLink to="/tickets/new"
                class="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm"
                style="background:white;color:#1a56db">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Reportar Incidencia
              </NuxtLink>
              <p class="text-white/50 text-xs">{{ new Date().toLocaleDateString('es-MX', {weekday:'long',day:'numeric',month:'long'}) }}</p>
            </div>
          </div>
        </div>

        <!-- Stats cards con gradientes -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="rounded-xl p-4 relative overflow-hidden"
            style="background:linear-gradient(135deg,#059669,#10b981)">
            <div class="absolute right-3 top-3 opacity-20">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p class="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Abiertas</p>
            <p class="text-4xl font-bold text-white">{{ myCount('OPEN') }}</p>
            <p class="text-white/60 text-xs mt-1">Requieren atención</p>
          </div>

          <div class="rounded-xl p-4 relative overflow-hidden"
            style="background:linear-gradient(135deg,#d97706,#f59e0b)">
            <div class="absolute right-3 top-3 opacity-20">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <p class="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">En Progreso</p>
            <p class="text-4xl font-bold text-white">{{ myCount('IN_PROGRESS') }}</p>
            <p class="text-white/60 text-xs mt-1">Siendo atendidas</p>
          </div>

          <div class="rounded-xl p-4 relative overflow-hidden"
            style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">
            <div class="absolute right-3 top-3 opacity-20">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <p class="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Resueltas</p>
            <p class="text-4xl font-bold text-white">{{ myCount('CLOSED') }}</p>
            <p class="text-white/60 text-xs mt-1">Incidencias cerradas</p>
          </div>
        </div>

        <!-- Tabla de mis tickets -->
        <div class="card p-0 mb-6" style="overflow:hidden">
          <div class="flex items-center justify-between px-5 py-4"
            style="background:linear-gradient(90deg,rgba(26,86,219,0.05),transparent);border-bottom:1px solid var(--border-soft)">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" style="background:#1a56db"></div>
              <p class="text-sm font-semibold" style="color:var(--text)">Mis Incidencias</p>
              <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
                style="background:rgba(26,86,219,0.1);color:#1a56db">{{ myTickets.length }}</span>
            </div>
            <NuxtLink to="/tickets/new"
              class="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style="background:rgba(26,86,219,0.1);color:#1a56db">
              + Nueva
            </NuxtLink>
          </div>

          <div v-if="myTickets.length">
            <div v-for="t in myTickets" :key="t.id"
              class="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all"
              style="border-bottom:1px solid var(--border-soft)"
              onmouseover="this.style.background='rgba(26,86,219,0.03)'"
              onmouseout="this.style.background='transparent'"
              @click="navigateTo(`/tickets/${t.id}`)">

              <!-- Número -->
              <span class="text-xs font-mono font-bold flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style="background:var(--surface2);color:var(--muted)">#{{ t.id }}</span>

              <!-- Título -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold truncate" style="color:var(--text)">{{ t.title }}</p>
                <p class="text-xs truncate" style="color:var(--muted)">{{ t.category }}</p>
              </div>

              <!-- Badges -->
              <div class="flex items-center gap-2 flex-shrink-0">
                <StatusBadge :status="t.status" />
                <PriorityBadge :priority="t.priority" />
              </div>

              <!-- Fecha -->
              <span class="text-xs flex-shrink-0 font-mono" style="color:var(--muted-2)">
                {{ new Date(t.createdAt).toLocaleDateString('es-MX') }}
              </span>

              <!-- Flecha -->
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted-2);flex-shrink:0">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-16 gap-3">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center"
              style="background:linear-gradient(135deg,rgba(26,86,219,0.1),rgba(124,58,237,0.1))">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a56db" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
              </svg>
            </div>
            <p class="text-sm font-semibold" style="color:var(--text)">Sin incidencias aún</p>
            <p class="text-xs" style="color:var(--muted)">Cuando reportes un problema aparecerá aquí</p>
            <NuxtLink to="/tickets/new"
              class="mt-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style="background:linear-gradient(135deg,#1a56db,#7c3aed)">
              Reportar primera incidencia
            </NuxtLink>
          </div>
        </div>

      </template>
    </template>

    <!-- ===================== CHATBOT ===================== -->
    <div v-if="!isAdminOrAgent || true">

      <!-- Botón flotante -->
      <button
        v-if="!chatOpen"
        @click="chatOpen = true"
        class="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 transition-transform hover:scale-110"
        style="background:linear-gradient(135deg,#1a56db,#7c3aed)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span v-if="unreadBot" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">1</span>
      </button>

      <!-- Ventana del chat -->
      <div v-if="chatOpen"
        class="fixed bottom-6 right-6 w-80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
        style="height:460px;background:var(--surface);border:1px solid var(--border)">

        <!-- Header -->
        <div class="flex items-center gap-3 px-4 py-3 flex-shrink-0"
          style="background:linear-gradient(135deg,#1a56db,#7c3aed)">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style="background:rgba(255,255,255,0.2)">IA</div>
          <div class="flex-1">
            <p class="text-white text-sm font-semibold leading-tight">Asistente de Soporte</p>
            <p class="text-white/60 text-xs">Powered by Claude AI</p>
          </div>
          <button @click="chatOpen = false" class="text-white/70 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Mensajes -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3">
          <div v-for="(msg, i) in chatMessages" :key="i"
            :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'">
            <div :class="msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'"
              class="max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed">
              {{ msg.content }}
            </div>
          </div>
          <div v-if="botTyping" class="flex justify-start">
            <div class="chat-bubble-bot px-3 py-2 rounded-xl flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full" style="background:#94a3b8;animation:bounce 1s infinite 0s"></span>
              <span class="w-1.5 h-1.5 rounded-full" style="background:#94a3b8;animation:bounce 1s infinite 0.15s"></span>
              <span class="w-1.5 h-1.5 rounded-full" style="background:#94a3b8;animation:bounce 1s infinite 0.3s"></span>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div class="px-3 py-3 flex-shrink-0" style="border-top:1px solid var(--border-soft)">
          <div class="flex gap-2">
            <input
              v-model="chatInput"
              @keydown.enter="sendMessage"
              :disabled="botTyping"
              placeholder="Escribe tu pregunta..."
              class="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style="background:var(--surface2);color:var(--text);border:1px solid var(--border)"
            />
            <button
              @click="sendMessage"
              :disabled="botTyping || !chatInput.trim()"
              class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-opacity"
              style="background:linear-gradient(135deg,#1a56db,#7c3aed)"
              :style="{ opacity: botTyping || !chatInput.trim() ? 0.5 : 1 }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.chat-bubble-user {
  background: linear-gradient(135deg,#1a56db,#7c3aed);
  color: white;
}
.chat-bubble-bot {
  background: var(--surface2);
  color: var(--text);
  border: 1px solid var(--border-soft);
}
</style>

<script setup>
import { useAuthStore } from '~/stores/auth'

definePageMeta({ ssr: false })

const auth    = useAuthStore()
const tickets = ref([])
const loading = ref(true)

// Chat
const chatOpen      = ref(false)
const chatInput     = ref('')
const botTyping     = ref(false)
const unreadBot     = ref(true)
const messagesContainer = ref(null)
const chatMessages  = ref([
  { role: 'assistant', content: '¡Hola! 👋 Soy tu asistente de soporte. Puedo ayudarte con preguntas sobre tus tickets, cómo reportar incidencias, o cualquier duda sobre el sistema. ¿En qué te puedo ayudar?' }
])

onMounted(async () => {
  if (!auth.isLoggedIn) { navigateTo('/login'); return }
  try {
    tickets.value = await $fetch('/api/tickets', {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
  } catch (e) {
    console.error('Error cargando tickets:', e)
  } finally {
    loading.value = false
  }
})

watch(chatOpen, (val) => {
  if (val) { unreadBot.value = false }
})

async function sendMessage() {
  const msg = chatInput.value.trim()
  if (!msg || botTyping.value) return

  chatMessages.value.push({ role: 'user', content: msg })
  chatInput.value = ''
  botTyping.value = true

  await nextTick()
  scrollChat()

  try {
    // Contexto de tickets del usuario
    const ticketSummary = myTickets.value.length
      ? myTickets.value.map(t => `#${t.id} "${t.title}" (${t.status}, ${t.priority})`).join(', ')
      : 'Sin tickets aún'

    const systemPrompt = `Eres un asistente de soporte TI para un sistema de tickets de Epicor Kinetic. 
El usuario se llama ${auth.user?.name}. 
Sus tickets actuales son: ${ticketSummary}.
Responde en español, de forma amable, concisa y útil. 
Puedes ayudar con: cómo reportar incidencias, qué significa cada estado (OPEN=abierto, IN_PROGRESS=en progreso, CLOSED=cerrado), prioridades, y preguntas generales sobre Epicor Kinetic.
Si te preguntan algo fuera de tu alcance, sugiere contactar directamente al equipo de soporte.
Mantén respuestas cortas (máx 3 oraciones).`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: systemPrompt,
        messages: chatMessages.value
          .filter(m => m.role !== 'assistant' || chatMessages.value.indexOf(m) > 0)
          .slice(-6)
          .map(m => ({ role: m.role, content: m.content }))
      })
    })

    const data = await res.json()
    const reply = data.content?.[0]?.text || 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.'
    chatMessages.value.push({ role: 'assistant', content: reply })
  } catch (e) {
    chatMessages.value.push({ role: 'assistant', content: 'Hubo un error al conectar con el asistente. Por favor intenta de nuevo.' })
  } finally {
    botTyping.value = false
    await nextTick()
    scrollChat()
  }
}

function scrollChat() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const isAdminOrAgent = computed(() => ['ADMIN', 'AGENT'].includes(auth.user?.role))
const firstName      = computed(() => auth.user?.name?.split(' ')[0] || 'Usuario')
const total          = computed(() => tickets.value?.length || 0)

const countS    = s => tickets.value?.filter(t => t.status === s).length ?? 0
const countP    = p => tickets.value?.filter(t => t.priority === p).length ?? 0
const myTickets = computed(() => tickets.value?.filter(t => t.createdById === auth.user?.id) ?? [])
const myCount   = s => myTickets.value.filter(t => t.status === s).length

const openPct = computed(() => total.value ? (countS('OPEN') / total.value) * 100 : 0)
const inPct   = computed(() => total.value ? (countS('IN_PROGRESS') / total.value) * 100 : 0)

const recentTickets = computed(() =>
  [...(tickets.value ?? [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
)

const stats = computed(() => [
  { label:'Abiertos',    value: countS('OPEN'),        sub:'Requieren atención', color:'#059669', bg:'rgba(5,150,105,0.08)',   icon:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' },
  { label:'En Progreso', value: countS('IN_PROGRESS'), sub:'Siendo atendidos',   color:'#d97706', bg:'rgba(217,119,6,0.08)',   icon:'<circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>' },
  { label:'Cerrados',    value: countS('CLOSED'),       sub:'Resueltos',          color:'#475569', bg:'rgba(71,85,105,0.08)',  icon:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>' },
  { label:'Total',       value: total.value,            sub:'En el sistema',      color:'#1a56db', bg:'rgba(26,86,219,0.08)',  icon:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
])

const statusLegend = computed(() => [
  { label:'Abiertos',    value: countS('OPEN'),        color:'#059669' },
  { label:'En Progreso', value: countS('IN_PROGRESS'), color:'#d97706' },
  { label:'Cerrados',    value: countS('CLOSED'),       color:'#94a3b8' },
])

const topCategories = computed(() => {
  const m = {}
  tickets.value?.forEach(t => { m[t.category] = (m[t.category] || 0) + 1 })
  return Object.entries(m).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 6)
})
const maxCat = computed(() => topCategories.value[0]?.count || 1)

const priorityStats = computed(() => [
  { key:'CRITICAL', label:'Crítica', color:'#dc2626', count: countP('CRITICAL'), badgeStyle:'background:#fef2f2;color:#b91c1c;border:1px solid #fecaca' },
  { key:'HIGH',     label:'Alta',    color:'#f97316', count: countP('HIGH'),     badgeStyle:'background:#fff7ed;color:#c2410c;border:1px solid #fed7aa' },
  { key:'MEDIUM',   label:'Media',   color:'#eab308', count: countP('MEDIUM'),   badgeStyle:'background:#fefce8;color:#854d0e;border:1px solid #fde68a' },
  { key:'LOW',      label:'Baja',    color:'#3b82f6', count: countP('LOW'),      badgeStyle:'background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe' },
])
</script>
