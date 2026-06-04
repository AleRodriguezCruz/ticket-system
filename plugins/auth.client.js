// plugins/auth.client.js
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()
  console.log('🔐 Auth plugin cargado - Usuario:', authStore.user?.email)
  console.log('🔐 Auth plugin - Token existe:', !!authStore.token)
})
