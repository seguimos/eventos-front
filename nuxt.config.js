import colors from 'vuetify/es5/util/colors'
import es from 'vuetify/lib/locale/es'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  // target: 'static',
  debug: process.env.DEBUG || false,
  ssr: true,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Eventos por Boric',
    title: 'Eventos por Boric',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Eventos por Gabriel Boric Presidente' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary_large_image'
      }, {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: process.env.DOMAIN
      }, {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Eventos por Boric'
      }, {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Eventos por Gabriel Boric Presidente'
      }, {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: process.env.DOMAIN ? process.env.DOMAIN + '/BoricFoto.jpg' : ''
      }, {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: 'Eventos por Boric'
      }, {
        hid: 'twitter:site',
        name: 'twitter:site',
        content: 'Eventos x Boric'
      }, {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'Eventos por Boric'
      }, {
        hid: 'og:title',
        name: 'og:title',
        content: 'Eventos por Boric'
      }, {
        hid: 'og:description',
        name: 'og:description',
        content: 'Eventos por Gabriel Boric Presidente'
      }, {
        hid: 'og:image',
        name: 'og:image',
        content: process.env.DOMAIN ? process.env.DOMAIN + '/BoricFoto.jpg' : ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'nuxt-leaflet',
    '@nuxtjs/auth-next',
    '@nuxtjs/recaptcha'
  ],
  auth: {
    strategies: {
      laravelJWT: {
        provider: 'laravel/jwt',
        url: process.env.BACK_BASE_URL,
        endpoints: {
          login: {
            url: '/auth/login'
          },
          refresh: {
            url: '/auth/refresh'
          },
          logout: {
            url: '/auth/logout'
          },
          user: {
            url: '/auth/user'
          }
        },
        token: {
          property: 'access_token',
          maxAge: 60 * 60
        },
        refreshToken: {
          maxAge: 20160 * 60
        }
      }
    }
  },
  // reCaptcha module confituration: https://github.com/nuxt-community/recaptcha-module
  recaptcha: {
    hideBadge: true, // Hide badge element (v3 & v2 via size=invisible)
    language: 'es', // Recaptcha language (v2)
    siteKey: process.env.RECAPTCHA_SITE_KEY, // Site key for requests
    version: 3, // Version
    size: 'invisible' // Size: 'compact', 'normal', 'invisible' (v2)
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BACK_BASE_URL,
    headers: {
      get: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
      }
    }
  },
  router: {
    middleware: ['auth']
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    lang: {
      locales: { es },
      current: 'es'
    },
    theme: {
      themes: {
        light: {
          primary: '#094c68',
          accent: colors.grey.lighten3,
          secondary: '#dbf87b',
          tertiary: '#0e8974',
          quaternary: '#177496',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
