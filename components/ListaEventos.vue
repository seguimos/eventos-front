<template>
  <v-row>
    <v-col
      v-for="(evento, index) in eventos"
      :key="index"
      cols="12"
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
      />
    </v-col>
  </v-row>
</template>

<script>
import EventoCard from '~/components/EventoCard'
export default {
  name: 'ListaEventos',
  components: { EventoCard },
  props: {
    eventos: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
