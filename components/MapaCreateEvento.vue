<template>
  <div id="map-wrap" class="map-container">
    <client-only>
      <l-map
        ref="mapaEvento"
        :zoom.sync="zoom"
        :center.sync="center"
        :options="{zoomSnap: 0.1}"
        class="map"
      >
        <l-tile-layer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
      </l-map>
    </client-only>
  </div>
</template>

<script>
import * as topojson from 'topojson'
import chileComunas from '~/assets/chile-comunas.json'
import { coordinateInsidePolygon } from '~/utils'

const chileComunasGeoJson = topojson.feature(chileComunas, chileComunas.objects.Final).features

export default {
  name: 'MapaCreateEvento',
  props: {
    lat: {
      type: Number,
      default: 0
    },
    lng: {
      type: Number,
      default: 0
    },
    regionId: {
      type: Number,
      default: null
    },
    comunaId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      center: [-33.4449058, -70.654855],
      zoom: 13,
      chileComunasGeoJson,
      marker: null,
      dontWatchRegionComuna: false
    }
  },
  watch: {
    regionId (val) {
      if (this.dontWatchRegionComuna) { return }
      if (val) {
        this.moveToRegionComuna(val, 'region')
      }
    },
    comunaId (val) {
      if (this.dontWatchRegionComuna) { return }
      if (val) {
        this.moveToRegionComuna(val, 'comuna')
      } else if (this.regionId) {
        this.moveToRegionComuna(this.regionId, 'region')
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$forceUpdate()
      if (this.comunaId) {
        this.moveToRegionComuna(this.comunaId, 'comuna')
      } else if (this.selectedRegionId) {
        this.moveToRegionComuna(this.regionId, 'region')
      }
      this.initMarkerDrag()
    })
  },
  methods: {
    moveToCoordinates (lat, lng) {
      this.marker.setLatLng(new this.$L.LatLng(lat, lng))
    },
    initMarkerDrag () {
      const map = this.$refs.mapaEvento.mapObject
      if (!!this.lat && !!this.lng) {
        this.center = [this.lat, this.lng]
      }
      this.marker = this.$L.marker(map.getCenter()).addTo(map)
      map.on('move', () => {
        this.marker.setLatLng(map.getCenter())
        const coordinates = this.marker.getLatLng()
        this.$emit('update:lat', coordinates.lat)
        this.$emit('update:lng', coordinates.lng)
      }).on('moveend', () => {
        const coordinates = this.marker.getLatLng()
        this.checkChangeMarkerRegionComuna(coordinates)
      })
    },
    checkChangeMarkerRegionComuna (markerCoordinate) {
      chileComunasGeoJson.forEach((feature) => {
        const regionId = feature.properties.codregion
        const comunaId = feature.properties.cod_comuna
        const coordinates = feature.geometry.coordinates
        coordinates.forEach((pol) => {
          const polTemp = feature.geometry.type === 'MultiPolygon' ? pol[0] : pol
          if (coordinateInsidePolygon(markerCoordinate, polTemp)) {
            this.$nextTick(() => {
              this.dontWatchRegionComuna = true
              this.$nextTick(() => {
                if (this.regionId !== regionId) {
                  this.$emit('update:region-id', regionId)
                }
                if (this.comunaId !== comunaId) {
                  this.$emit('update:comuna-id', comunaId)
                }
                this.$nextTick(() => {
                  this.dontWatchRegionComuna = false
                })
              })
            })
          }
        })
      })
    },
    moveToRegionComuna (regionComunaId, regionOComuna) {
      const map = this.$refs.mapaEvento.mapObject
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
      if (!maxX || !maxY || !minX || !minY) { return }
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
  width: 100%;
}

.map {
  z-index:1;
  height: 350px;
  width: 100%;
}
</style>
