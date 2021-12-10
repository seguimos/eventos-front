<template>
  <div id="map-wrap" class="map-container">
    <client-only>
      <l-map
        ref="mapaEventos"
        :zoom.sync="zoom"
        :center.sync="center"
        :options="{zoomSnap: 0.1}"
        class="map"
      >
        <l-tile-layer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          :attribution="attribution"
        />
        <l-marker
          :lat-lng="[latitud, longitud]"
        >
          <l-popup>
            <strong>{{ evento.evento }}</strong>
            <br>
            <strong>Fecha:</strong> {{ date(evento.dateTimeStart) }} - {{ time(evento.dateTimeStart) }}Hrs.
            <div v-if="evento.direccion">
              <strong>Direccion:</strong> {{ evento.direccion }}
            </div>
            <strong>Comando:</strong> {{ evento.comando }}
            <br>
            <a @click="$router.push('/evento/'+evento.evento)">
              Ver Evento
            </a>
            <br>
            <a
              target="_blank"
              :href="`https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`"
            >
              Ver en Google Maps
            </a>
          </l-popup>
        </l-marker>
      </l-map>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'MapaEvento',
  props: {
    latitud: {
      type: Number,
      default: 0
    },
    longitud: {
      type: Number,
      default: 0
    },
    evento: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      zoom: 13,
      center: [0, 0],
      dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      attribution: ''
    }
  },
  watch: {
    latitud (val) {
      this.center = [val, this.longitud]
      this.attributionGenerate(val, this.longitud)
    },
    longitud (val) {
      this.center = [this.latitud, val]
      this.attributionGenerate(this.latitud, val)
    }
  },
  mounted () {
    this.center = [this.latitud, this.longitud]
  },
  methods: {
    attributionGenerate (latitud, longitud) {
      this.attribution = `<a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}">Ver en Google Maps</a>`
    },
    date (dateTime) {
      return dateTime
        ? new Date(dateTime).toLocaleDateString('es', this.dateOptions)
        : ''
    },
    time (dateTime) {
      return dateTime.split(' ')[1]?.slice(0, -3)
    }
  }
}
</script>

<style scoped>
.map-container {
  height: 350px;
}

.map {
  z-index:1
}
</style>
