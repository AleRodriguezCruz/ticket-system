// plugins/auth.client.js
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()
  console.log('🔐 Auth plugin: sesión cargada en cliente')
})
