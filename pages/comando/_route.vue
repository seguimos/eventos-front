<template>
  <v-row justify="center">
    <DialogSharePage
      v-model="shareDialog"
      :title="comando.comando"
      :url="url"
    />
    <v-col cols="12" sm="10" md="8">
      <v-card class="rounded-sm">
        <v-card-title style="font-size: 30px">
          {{ comando.comando }}
        </v-card-title>
        <v-card-subtitle class="pt-4">
          <v-chip
            small
            color="primary"
            class="white--text rounded-sm"
          >
            {{ comando.region }}
          </v-chip>
          <v-chip
            v-if="comando.comuna"
            small
            color="quaternary"
            class="white--text rounded-sm"
          >
            {{ comando.comuna }}
          </v-chip>
        </v-card-subtitle>
        <v-card-subtitle>
          <v-row justify="space-around">
            <v-col cols="auto">
              <v-btn
                v-if="comando.facebookUrl"
                :href="comando.facebookUrl"
                target="_blank"
                fab
                small
                class="rounded-sm"
                color="#3b5998"
                elevation="0"
              >
                <v-icon
                  color="white"
                >
                  mdi-facebook
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                v-if="comando.instagramUrl"
                :href="comando.instagramUrl"
                target="_blank"
                elevation="0"
                fab
                small
                class="rounded-sm"
                style="background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"
              >
                <v-icon
                  color="white"
                >
                  mdi-instagram
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                v-if="comando.twitterUrl"
                :href="comando.twitterUrl"
                target="_blank"
                fab
                small
                class="rounded-sm"
                color="#00acee"
                elevation="0"
              >
                <v-icon
                  color="white"
                >
                  mdi-twitter
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                v-if="comando.tiktokUrl"
                :href="comando.tiktokUrl"
                target="_blank"
                fab
                small
                class="rounded-sm"
                color="black"
                elevation="0"
              >
                <div class="tiktok-icon" />
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                v-if="comando.email"
                :href="'mailto:'+comando.email"
                target="_blank"
                fab
                small
                class="rounded-sm"
                color="red"
                elevation="0"
              >
                <v-icon
                  color="white"
                >
                  mdi-email-outline
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                v-if="comando.telefono"
                :href="'https://api.whatsapp.com/send?text=Hola! Me interesa participar&phone='+comando.telefono"
                target="_blank"
                fab
                small
                class="rounded-sm"
                color="#25D366"
                elevation="0"
              >
                <v-icon
                  color="white"
                >
                  mdi-whatsapp
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                target="_blank"
                fab
                small
                class="rounded-sm"
                color="primary"
                elevation="0"
                @click="shareDialog = true"
              >
                <v-icon
                  color="white"
                >
                  mdi-share-variant
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-title>
          Eventos del Comando
        </v-card-title>
        <v-card-text>
          <v-col
            v-for="(evento, index) in comando.eventos"
            :key="index"
            cols="12"
            sm="6"
          >
            <EventoCard
              :evento="evento.evento"
              :evento-id="evento.id"
              :comando="evento.comando"
              :region="evento.region"
              :comuna="evento.comuna"
              :date-time-start="evento.dateTimeStart"
              :descripcion="evento.descripcion"
              :image-url="evento.imageUrl"
              :direccion="evento.direccion"
              :route="evento.route"
            />
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const domain = process.env.DOMAIN

export default {
  name: 'Comando',
  auth: false,
  data () {
    return {
      shareDialog: false,
      comando: {
        comando: '',
        region: '',
        comuna: '',
        comandoTematico: true,
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        tiktokUrl: '',
        email: '',
        telefono: '',
        eventos: []
      }
    }
  },
  async fetch () {
    const route = this.$route.params.route
    await this.$axios.$get('/comando/' + route)
      .then((response) => {
        this.comando = response.comando
      })
      .catch((error) => {
        if (error.status === 404) {
          this.$router.push('404')
        }
      })
  },
  head () {
    const url = domain ? domain + this.$route.fullPath : ''
    return {
      title: 'Comando ' + this.comando.comando,
      link: [{
        ref: 'canonical',
        href: url
      }],
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.comando.descripcion
      }, {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: url
      }, {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: `Comando ${this.comando.comando}`
      }, {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: this.comando.descripcion
      }, {
        hid: 'twitter:label1',
        name: 'twitter:label1',
        content: `Comando ${this.comando.comando}`
      }, {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: `Comando ${this.comando.comando}`
      }, {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: `Comando ${this.comando.comando}`
      }, {
        hid: 'og:title',
        name: 'og:title',
        content: `Comando ${this.comando.comando}`
      }, {
        hid: 'og:description',
        name: 'og:description',
        content: this.comando.descripcion
      }]
    }
  },
  computed: {
    url () {
      return domain ? (domain + this.$route.fullPath) : ''
    }
  }
}
</script>

<style class="sass" scoped>
.tiktok-icon {
  background-color: white;
  mask-image: url('/tiktok.svg');
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  aspect-ratio: 1;
  width: 20px;
  font-size: 20px;
}
</style>
