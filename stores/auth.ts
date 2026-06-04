import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },

  actions: {
    setAuth(user, token) {
      this.user = user
      this.token = token
      // ⭐ Solo ejecutar en el cliente
      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    loadFromStorage() {
      // ⭐ Solo ejecutar en el cliente
      if (!process.client) return false
      
      try {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          console.log('✅ Sesión cargada:', this.user?.name)
          return true
        }
      } catch (e) {
        console.error('Error loading from storage:', e)
      }
      return false
    },

    async login(email, password) {
      try {
        const data = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        this.setAuth(data.user, data.token)
        return { success: true, user: data.user }
      } catch (error) {
        return { success: false, error: error.data?.message || 'Error de autenticación' }
      }
    },

    logout() {
      this.user = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      navigateTo('/login')
    }
  }
})
