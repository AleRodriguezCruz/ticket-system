import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin:    (state) => state.user?.role === 'ADMIN',
    isAgent:    (state) => state.user?.role === 'AGENT',
    isAdminOrAgent: (state) => ['ADMIN', 'AGENT'].includes(state.user?.role)
  },

  actions: {
    setAuth(user: any, token: string) {
      this.user  = user
      this.token = token
      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    loadFromStorage() {
      if (!process.client) return false
      try {
        const token = localStorage.getItem('token')
        const user  = localStorage.getItem('user')
        if (token && user) {
          this.token = token
          this.user  = JSON.parse(user)
          return true
        }
      } catch (e) {
        console.error('Error loading from storage:', e)
      }
      return false
    },

    async login(email: string, password: string) {
      try {
        const data: any = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })
        this.setAuth(data.user, data.token)
        return { success: true, user: data.user }
      } catch (error: any) {
        return { success: false, error: error.data?.message || 'Error de autenticación' }
      }
    },

    logout() {
      this.user  = null
      this.token = null
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      navigateTo('/login')
    },

    fetchWithAuth(url: string, options: Record<string, any> = {}) {
      return $fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.token}`
        }
      })
    }
  }
})
