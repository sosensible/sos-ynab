export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  future: {
    compatibilityVersion: 4,
  },
  
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000/api',
      ynab: {
        apiKey: process.env.YNAB_ACCESS_TOKEN || '',
        clientId: process.env.YNAB_CLIENT_ID || '',
        clientSecret: process.env.YNAB_CLIENT_SECRET || '',
        redirectUri: process.env.YNAB_REDIRECT_URI || '',
      }
    },
    private: {
      calendarUrl: process.env.CALENDAR_URL || '',
    }
  },

  ssr: false,
})
