<template>
  <div>
    <SelectorLugarEventos
      :selected-region-id.sync="selectedRegionId"
      :selected-comuna-id.sync="selectedComunaId"
    />
    <v-row>
      <v-col cols="12">
        <h1 class="primary--text">
          Eventos
        </h1>
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <Mapa
          :eventos="eventosFiltrados"
          :selected-region-id.sync="selectedRegionId"
          :selected-comuna-id.sync="selectedComunaId"
        />
      </v-col>
      <v-col
        v-for="(evento, index) in eventos"
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
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Mapa from '~/components/Mapa'
import EventoCard from '~/components/EventoCard'
import SelectorLugarEventos from '~/components/SelectorLugarEventos'
export default {
  name: 'Eventos',
  components: { SelectorLugarEventos, Mapa, EventoCard },
  data () {
    return {
      selectedRegionId: null,
      selectedComunaId: null,
      eventos: []
    }
  },
  computed: {
    eventosFiltrados () {
      if (!this.selectedRegionId && !this.selectedComunaId) {
        return this.eventos
      }
      return this.eventos.filter((evento) => {
        return (this.selectedRegionId
          ? evento.regionId === this.selectedRegionId
          : true) &&
        (this.selectedComunaId
          ? evento.comunaId === this.selectedComunaId
          : true)
      })
    }
  },
  mounted () {
    this.getEventos()
  },
  methods: {
    getEventos () {
      this.$axios.$get('/eventos')
        .then((response) => {
          this.eventos = response.eventos
        })
    }
  }
}
</script>

<style scoped>

</style>
