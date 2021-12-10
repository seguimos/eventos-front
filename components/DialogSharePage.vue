<template>
  <v-dialog
    :value="value"
    width="500"
    @click:outside="$emit('input', false)"
    @change="$emit('input', false)"
  >
    <v-card>
      <v-card-title>
        Comparte
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-btn
              block
              class="rounded-0 white--text"
              target="_blank"
              :href="compartirFacebook"
              elevation="0"
              color="#3b5998"
            >
              <v-icon left>
                mdi-facebook
              </v-icon>
              Facebook
            </v-btn>
            <v-btn
              class="rounded-0 white--text"
              target="_blank"
              :href="compartirWhatsApp"
              elevation="0"
              block
              color="#25D366"
            >
              <v-icon left>
                mdi-whatsapp
              </v-icon>
              WhatsApp
            </v-btn>
            <v-btn
              class="rounded-0 white--text"
              target="_blank"
              :href="compartirTwitter"
              elevation="0"
              block
              color="#00acee"
            >
              <v-icon left>
                mdi-twitter
              </v-icon>
              Twitter
            </v-btn>
            <v-btn
              class="rounded-0 white--text"
              target="_blank"
              elevation="0"
              block
              color="grey"
              @click="$emit('input', false)"
            >
              <v-icon left>
                mdi-close
              </v-icon>
              Cerrar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'ShareDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    facebookUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    compartirTwitter () {
      return 'https://twitter.com/intent/tweet?text=' +
        this.title +
        ' ' +
        this.url
    },
    compartirFacebook () {
      return 'https://www.facebook.com/sharer.php?u=' + (this.facebookUrl ? this.facebookUrl : this.url)
    },
    compartirWhatsApp () {
      return 'https://api.whatsapp.com/send?text=Vamos! ' + this.url
    }
  }
}
</script>

<style scoped>

</style>
