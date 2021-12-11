<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="10">
      <v-card elevation="0">
        <v-card-title>
          Comandos
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-select
                v-model="selectedRegionId"
                label="Region"
                item-value="id"
                item-text="region"
                clearable
                :items="regiones"
              />
            </v-col>
            <v-col>
              <v-autocomplete
                v-model="selectedComunaId"
                label="Comuna"
                item-value="id"
                item-text="comuna"
                clearable
                :items="comunas"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="selectedTipoComando"
                label="Tipo Comando"
                :items="tiposComandos"
              />
            </v-col>
          </v-row>
          <v-data-table
            :headers="table.headers"
            :items="comandosFiltrados"
            :loading="table.loading"
          >
            <template #[`item.region`]="{item}">
              {{ getRegion(item.regionId) }}
            </template>
            <template #[`item.comuna`]="{item}">
              {{ getComuna(item.comunaId) }}
            </template>
            <template #[`item.tematico`]="{item}">
              {{ item.comandoTematico? 'Sí': 'No' }}
            </template>
            <template #[`item.ver`]="{item}">
              <v-btn fab color="primary" x-small @click="verComando(item.route)">
                <v-icon small>
                  mdi-eye
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import divisionesTerritoriales from '~/assets/divisionesTerritoriales.json'

export default {
  name: 'Comandos',
  auth: false,
  data () {
    return {
      selectedRegionId: null,
      selectedComunaId: null,
      selectedTipoComando: null,
      comandos: [],
      tiposComandos: [
        { text: 'Todos', value: null },
        { text: 'Territoriales', value: false },
        { text: 'Temáticos', value: true }
      ],
      table: {
        headers: [
          { text: 'Comando', value: 'comando', sortable: true },
          { text: 'Region', value: 'region', sortable: true },
          { text: 'Comuna', value: 'comuna', sortable: true },
          { text: 'Tematico', value: 'tematico', sortable: true },
          { text: 'Ver', value: 'ver', sortable: false, align: 'center' }
        ],
        loading: false
      }
    }
  },
  head () {
    const url = process.env.DOMAIN ? process.env.DOMAIN + this.$route.fullPath : ''
    return {
      title: 'Comandos x Boric',
      link: [{
        ref: 'canonical',
        href: url
      }],
      meta: [{
        hid: 'description',
        name: 'description',
        content: 'Comandos por Boric'
      }, {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: url
      }, {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Comandos x Boric'
      }, {
        hid: 'twitter:description',
        name: 'twitter:description',
        content: 'Comandos por Boric'
      }, {
        hid: 'twitter:creator',
        name: 'twitter:creator',
        content: 'Comandos por Boric'
      }, {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'Comandos x Boric'
      }, {
        hid: 'og:title',
        name: 'og:title',
        content: 'Comandos x Boric'
      }, {
        hid: 'og:description',
        name: 'og:description',
        content: 'Comandos por Boric'
      }]
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
    },
    comandosFiltrados () {
      if (!this.selectedRegionId && !this.selectedComunaId && this.selectedTipoComando === null) {
        return this.comandos
      }
      return this.comandos.filter((comando) => {
        return (this.selectedRegionId
          ? comando.regionId === this.selectedRegionId
          : true) &&
          (this.selectedComunaId
            ? comando.comunaId === this.selectedComunaId
            : true) &&
          (this.selectedTipoComando !== null
            ? comando.comandoTematico === this.selectedTipoComando
            : true)
      })
    }
  },
  mounted () {
    this.getComandos()
  },
  methods: {
    verComando (eventoRoute) {
      this.$router.push('/comando/' + eventoRoute)
    },
    getRegion (regionId) {
      const region = this.regiones.find(region => region.id === regionId)
      return region ? region.region : 'Sin región'
    },
    getComuna (comunaId) {
      const comuna = this.comunas.find(comuna => comuna.id === comunaId)
      return comuna ? comuna.comuna : 'Sin Comuna'
    },
    getComandos () {
      this.table.loading = true
      this.$axios.$get('comandos')
        .then((response) => {
          this.comandos = response.comandos
        })
        .finally(() => {
          this.table.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
