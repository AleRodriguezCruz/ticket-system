import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { id: number; name: string; email: string; role: string },
    token: null as null | string
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin:    (state) => state.user?.role === 'ADMIN'
  },

  actions: {
    setAuth(user: any, token: string) {
      this.user  = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    loadFromStorage() {
      const token = localStorage.getItem('token')
      const user  = localStorage.getItem('user')
      if (token && user) {
        this.token = token
        this.user  = JSON.parse(user)
      }
    },

    logout() {
      this.user  = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigateTo('/login')
    }
  }
})