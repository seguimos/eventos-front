import colors from 'vuetify/es5/util/colors'
import es from 'vuetify/lib/locale/es'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  // target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - eventos-boric-front',
    title: 'eventos-boric-front',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
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
    '@nuxtjs/auth-next'
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
