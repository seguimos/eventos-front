<template>
  <v-row justify="center" align="center">
    <DialogCreateEditEvento
      v-model="createEditDialog.dialog"
      :evento-id="createEditDialog.eventoId"
    />
    <DialogDeleteEvento
      v-model="deleteDialog.dialog"
      :evento-id="deleteDialog.eventoId"
      :evento="deleteDialog.evento"
    />
    <v-col cols="12" md="10" lg="8">
      <v-card>
        <v-card-title>
          Administrador de Eventos
        </v-card-title>
        <v-card-text>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="openDialogCreate"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>
                Crear Evento
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="table.headers"
                :items="eventos"
                :loading="table.loading"
              >
                <template #[`item.region`]="{item}">
                  {{ getRegion(item.regionId) }}
                </template>
                <template #[`item.comuna`]="{item}">
                  {{ getComuna(item.comunaId) }}
                </template>
                <template #[`item.editar`]="{item}">
                  <v-btn
                    fab
                    color="primary"
                    x-small
                    @click="openDialogEdit(item.id)"
                  >
                    <v-icon>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
                <template #[`item.eliminar`]="{item}">
                  <v-btn
                    fab
                    color="error"
                    x-small
                    @click="openDialogDelete(item)"
                  >
                    <v-icon>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import DialogDeleteEvento from '~/components/DialogDeleteEvento'
import divisionesTerritoriales from '~/assets/divisionesTerritoriales.json'
import DialogCreateEditEvento from '~/components/DialogCreateEditEvento'

export default {
  name: 'AdminEventos',
  components: { DialogCreateEditEvento, DialogDeleteEvento },
  data () {
    return {
      createEditDialog: {
        dialog: false,
        eventoId: null
      },
      table: {
        headers: [
          { text: 'Evento', value: 'evento', sortable: true },
          { text: 'Comando', value: 'comando', sortable: true },
          { text: 'Region', value: 'region', sortable: true },
          { text: 'Comuna', value: 'comuna', sortable: true },
          { text: 'Editar', value: 'editar', sortable: false },
          { text: 'Eliminar', value: 'eliminar', sortable: false }
        ],
        loading: false
      },
      eventos: [],
      deleteDialog: {
        dialog: false,
        eventoId: null,
        evento: ''
      }
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
    }
  },
  watch: {
    'createEditDialog.dialog' (val) {
      if (!val) {
        this.getEventos()
      }
    },
    'deleteDialog.dialog' (val) {
      if (!val) {
        this.getEventos()
      }
    }
  },
  mounted () {
    if (!this.$auth.user.menus[0].submenus.some(el => el.route === 'admin-eventos')) {
      this.$router.push('error')
    }
    this.getEventos()
  },
  methods: {
    getRegion (regionId) {
      const region = this.regiones.find(region => region.id === regionId)
      return region ? region.region : 'Sin región'
    },
    getComuna (comunaId) {
      const comuna = this.comunas.find(comuna => comuna.id === comunaId)
      return comuna ? comuna.comuna : 'Sin Comuna'
    },
    getEventos () {
      this.table.loading = true
      this.$axios.$get('admin-eventos')
        .then((response) => {
          this.eventos = response.eventos
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    openDialogCreate () {
      this.createEditDialog.eventoId = null
      this.createEditDialog.dialog = true
    },
    openDialogEdit (eventoId) {
      this.createEditDialog.eventoId = eventoId
      this.createEditDialog.dialog = true
    },
    openDialogDelete (evento) {
      this.deleteDialog.eventoId = evento.id
      this.deleteDialog.evento = evento.evento
      this.deleteDialog.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
