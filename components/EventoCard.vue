<template>
  <v-card class="rounded-sm">
    <v-img
      v-if="imageUrl"
      :src="imageUrl"
      height="200px"
      aspect-ratio="16/9"
      :alt="'image_' + evento.toLowerCase().replace(' ', '_')"
    />
    <v-card-title class="pt-1">
      {{ evento }}
    </v-card-title>
    <v-card-subtitle class="pb-1">
      <v-chip
        v-if="comuna"
        small
        color="tertiary"
        class="white--text rounded-sm"
      >
        {{ comando }}
      </v-chip>
      <v-chip
        small
        color="primary"
        class="white--text rounded-sm"
      >
        {{ region }}
      </v-chip>
      <v-chip
        v-if="comuna"
        small
        color="quaternary"
        class="white--text rounded-sm"
      >
        {{ comuna }}
      </v-chip>
    </v-card-subtitle>
    <v-card-subtitle class="py-0 font-weight-bold">
      {{ date }} {{ time }}
    </v-card-subtitle>
    <v-card-text>
      {{ descripcion }}
    </v-card-text>
  </v-card>
</template>

<script>
import { formatDate } from '~/utils'

export default {
  name: 'EventoCard',
  props: {
    eventoId: {
      type: Number,
      default: null
    },
    imageUrl: {
      type: String,
      default: null
    },
    evento: {
      type: String,
      default: ''
    },
    comando: {
      type: String,
      default: ''
    },
    region: {
      type: String,
      default: ''
    },
    comuna: {
      type: String,
      default: ''
    },
    descripcion: {
      type: String,
      default: ''
    },
    dateTimeStart: {
      type: String,
      default: ''
    }
  },
  computed: {
    date () {
      return formatDate(this.dateTimeStart.split(' ')[0])
    },
    time () {
      return this.dateTimeStart.split(' ')[1]
    }
  }
}
</script>

<style scoped>

</style>
