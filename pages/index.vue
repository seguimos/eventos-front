<template>
  <v-row justify="center" align="center">
    <v-col cols="12" xl="10">
      <v-card elevation="0">
        <v-card-text>
          <Eventos />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Eventos from '~/components/Eventos'
export default {
  components: { Eventos },
  auth: false,
  head () {
    const url = process.env.DOMAIN ? process.env.DOMAIN + this.$route.fullPath : ''
    return {
      title: 'Eventos x Boric',
      link: [{
        ref: 'canonical',
        href: url
      }],
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Eventos por Boric'
      }, {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: url
      }, {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Eventos x Boric'
      }, {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Eventos por Boric'
      }, {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: 'Eventos por Boric'
      }, {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'Eventos x Boric'
      }, {
        hid: 'og:title',
        name: 'og:title',
        content: 'Eventos x Boric'
      }, {
        hid: 'og:description',
        name: 'og:description',
        content: 'Eventos por Boric'
      }]
    }
  }
}
</script>
