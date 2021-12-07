<template>
  <v-row>
    <v-col>
      <v-select
        label="Region"
        item-value="id"
        item-text="region"
        clearable
        :value="selectedRegionId"
        :items="regiones"
        @change="(event) => $emit('update:selected-region-id', event)"
      />
    </v-col>
    <v-col>
      <v-autocomplete
        label="Comuna"
        item-value="id"
        item-text="comuna"
        clearable
        :value="selectedComunaId"
        :items="comunas"
        @change="(event) => $emit('update:selected-comuna-id', event)"
      />
    </v-col>
  </v-row>
</template>

<script>
import divisionesTerritoriales from '~/assets/divisionesTerritoriales.json'

export default {
  name: 'SelectorLugarEventos',
  props: {
    selectedRegionId: {
      type: Number,
      default: null
    },
    selectedComunaId: {
      type: Number,
      default: null
    }
  },
  computed: {
    regiones () {
      return divisionesTerritoriales.map((region) => {
        return {
          id: region.id,
          region: region.region,
          number: region.region_number,
          iso_3166_2: region.region_iso_3166_2
        }
      })
    },
    comunas () {
      return divisionesTerritoriales.reduce((acc, region) => {
        if (this.selectedRegionId && this.selectedRegionId !== region.id) {
          return acc
        }
        region.provincias.forEach((provincia) => {
          provincia.comunas.forEach((comuna) => {
            const comunaTemp = {
              regionId: region.id,
              comuna: comuna.name,
              id: parseInt(comuna.id)
            }
            acc = [...acc, comunaTemp]
          })
        })
        return acc
      }, [])
        .sort((a, b) => a.comuna.localeCompare(b.comuna))
    }
  },
  watch: {
    selectedRegionId (val, oldVal) {
      if (val && oldVal !== val) {
        this.$emit('update:selected-comuna-id', null)
      }
    }
  }
}
</script>

<style scoped>

</style>
