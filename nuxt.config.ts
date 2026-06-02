export default defineNuxtConfig({
  compatibilityDate: '2026-02-19',
  future: {
    compatibilityVersion: 4
  },
  srcDir: '.',
  serverDir: './server',
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: false,
    typeCheck: false
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET
  }
})