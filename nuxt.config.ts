// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'https://localhost:8081',
    },
  },

  ssr: false, //only csr

  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],

  quasar: {
    iconSet: 'material-icons',
    plugins: ['Notify'],
    config: {
      notify: {
        position: 'top-right',
      },
    },
  },
})
