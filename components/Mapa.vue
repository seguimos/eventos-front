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
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
        <l-marker
          v-for="(evento, index) in eventos"
          :key="index"
          :lat-lng="[evento.latitud, evento.longitud]"
        />
      </l-map>
    </client-only>
  </div>
</template>

<script>
import * as topojson from 'topojson'
import chileComunas from '@/assets/chile-comunas.json'

const chileComunasGeoJson = topojson.feature(chileComunas, chileComunas.objects.Final).features

export default {
  props: {
    eventos: {
      type: Array,
      default: () => []
    },
    selectedRegionId: {
      type: Number,
      default: null
    },
    selectedComunaId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      center: [-33.4449058, -70.654855],
      zoom: 10,
      chileComunasGeoJson
    }
  },
  watch: {
    selectedRegionId (val) {
      if (val) {
        this.moveToRegionComuna(val, 'region')
      }
    },
    selectedComunaId (val) {
      if (val) {
        this.moveToRegionComuna(val, 'comuna')
      } else if (this.selectedRegionId) {
        this.moveToRegionComuna(this.selectedRegionId, 'region')
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.selectedComunaId) {
        this.moveToRegionComuna(this.selectedComunaId, 'comuna')
      } else if (this.selectedRegionId) {
        this.moveToRegionComuna(this.selectedRegionId, 'region')
      }
    })
  },
  methods: {
    moveToRegionComuna (regionComunaId, regionOComuna) {
      const map = this.$refs.mapaEventos.mapObject
      let maxX = null
      let minX = null
      let maxY = null
      let minY = null
      chileComunasGeoJson.forEach((feature) => {
        let featureId = null
        if (regionOComuna === 'region') {
          featureId = feature.properties.codregion
        } else if (regionOComuna === 'comuna') {
          featureId = feature.properties.cod_comuna
        }
        if (featureId && featureId === regionComunaId) {
          const coordinates = feature.geometry.coordinates
          coordinates.forEach((pol) => {
            const polTemp = feature.geometry.type === 'MultiPolygon' ? pol[0] : pol
            polTemp.forEach((coordinate) => {
              const x = coordinate[0]
              const y = coordinate[1]
              if (!maxX || x > maxX) {
                maxX = x
              }
              if (!minX || x < minX) {
                minX = x
              }
              if (!maxY || y > maxY) {
                maxY = y
              }
              if (!minY || x < minY) {
                minY = y
              }
            })
          })
        }
      })
      const marker1 = this.$L.marker([minY, minX])
      const marker2 = this.$L.marker([maxY, maxX])
      const group = this.$L.featureGroup([marker1, marker2])
      map.fitBounds(group.getBounds())
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
