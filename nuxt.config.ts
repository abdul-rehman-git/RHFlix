// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  telemetry: false,

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.NUXT_PUBLIC_TMDB_API_KEY || ''
    }
  },

  app: {
    head: {
      title: 'RHFlix - Stream Unlimited Movies & TV Shows',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: 'Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in HD. Fast, dynamic, cinematic OTT streaming platform.' },
        { name: 'theme-color', content: '#090a0f' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'RHFlix' },
        { name: 'application-name', content: 'RHFlix' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'RHFlix' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://rhflix.rehmanwebs.com/' },
        { property: 'og:title', content: 'RHFlix - Stream Unlimited Movies & TV Shows' },
        { property: 'og:description', content: 'Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in HD.' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'RHFlix - Stream Unlimited Movies & TV Shows' },
        { name: 'twitter:description', content: 'Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in HD.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://rhflix.rehmanwebs.com/' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap' }
      ]
    }
  }
})
