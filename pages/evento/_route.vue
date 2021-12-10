<template>
  <v-row justify="center">
    <DialogSharePage
      v-model="shareDialog"
      :title="evento.evento"
      :url="url"
      :facebook-url="evento.facebookUrl"
    />
    <v-col cols="12" sm="10" md="8">
      <v-card class="rounded-sm">
        <v-img
          :src="evento.imageUrl"
          lazy-src="data:image/jpeg;base64,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"
          :aspect-ratio="16/9"
          :alt="'image_' + $route.params.route.toLowerCase().replace(' ', '_')"
        >
          <template #placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              />
            </v-row>
          </template>
        </v-img>
        <v-card-title class="pt-1">
          {{ evento.evento }}
        </v-card-title>
        <v-card-subtitle class="pb-1">
          <v-chip
            v-if="evento.comando"
            small
            color="tertiary"
            class="white--text rounded-sm"
          >
            {{ evento.comando }}
          </v-chip>
          <v-chip
            small
            color="primary"
            class="white--text rounded-sm"
          >
            {{ evento.region }}
          </v-chip>
          <v-chip
            v-if="evento.comuna"
            small
            color="quaternary"
            class="white--text rounded-sm"
          >
            {{ evento.comuna }}
          </v-chip>
        </v-card-subtitle>
        <v-card-subtitle class="pt-0">
          <v-row justify="space-between">
            <v-col cols="12" sm="8">
              <strong>Desde:</strong> {{ dateStart }} {{ timeStart }}
              <br>
              <strong>Hasta:</strong> {{ dateEnd }} {{ timeEnd }}
              <div v-if="evento.direccion">
                <strong>Direccion:</strong> {{ evento.direccion }}
              </div>
            </v-col>
            <v-col cols="12" sm="4">
              <v-row justify="space-around">
                <v-col cols="auto">
                  <v-btn
                    v-if="evento.facebookUrl"
                    :href="evento.facebookUrl"
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
                    v-if="evento.instagramUrl"
                    :href="evento.instagramUrl"
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
            </v-col>
          </v-row>
        </v-card-subtitle>
        <v-card-text>
          {{ evento.descripcion }}
        </v-card-text>
        <v-card-text>
          <client-only>
            <MapaEvento
              :latitud="evento.latitud"
              :longitud="evento.longitud"
              :evento="evento"
            />
          </client-only>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
  name: 'Evento',
  auth: false,
  data () {
    return {
      shareDialog: false,
      evento: {
        evento: '',
        imageUrl: '',
        comando: '',
        region: '',
        comuna: '',
        descripcion: '',
        dateTimeStart: '',
        dateTimeEnd: '',
        longitud: 0,
        latitud: 0,
        facebookUrl: '',
        instagramUrl: ''
      },
      dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    }
  },
  async fetch () {
    const route = this.$route.params.route
    await this.$axios.$get('/evento/' + route)
      .then((response) => {
        this.evento = response.evento
      })
      .catch((error) => {
        if (error.status === 404) {
          this.$router.push('404')
        }
      })
  },
  head: {
    title: 'Evento'
  },
  computed: {
    url () {
      return process.env.DOMAIN ? process.env.DOMAIN + this.$route.fullPath : ''
    },
    dateStart () {
      return this.evento.dateTimeStart
        ? new Date(this.evento.dateTimeStart).toLocaleDateString('es', this.dateOptions)
        : ''
    },
    timeStart () {
      return this.evento.dateTimeStart.split(' ')[1]?.slice(0, -3)
    },
    dateEnd () {
      return this.evento.dateTimeEnd
        ? new Date(this.evento.dateTimeEnd).toLocaleDateString('es', this.dateOptions)
        : ''
    },
    timeEnd () {
      return this.evento.dateTimeStart.split(' ')[1]?.slice(0, -3)
    }
  }
}
</script>

<style scoped>

</style>
