<template>
  <v-row justify="center" align="center">
    <DialogCreateComando v-model="dialogCreate" />
    <DialogDeleteComando
      v-model="deleteDialog.dialog"
      :comando-id="deleteDialog.comandoId"
      :comando="deleteDialog.comando"
    />
    <DialogEditComando
      v-model="editDialog.dialog"
      :comando-id="editDialog.comandoId"
    />
    <DialogEditIntegrantesComando
      v-model="editIntegrantesDialog.dialog"
      :comando-id="editIntegrantesDialog.comandoId"
      :comando="editIntegrantesDialog.comando"
    />
    <v-col cols="12" md="10">
      <v-card>
        <v-card-title>
          Administrador de Comandos
        </v-card-title>
        <v-card-text>
          <v-row
            v-if="$auth.user.superadmin"
            justify="end"
          >
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="dialogCreate = true"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>
                Crear Comando
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="table.headers"
                :items="comandos"
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
                <template #[`item.integrantes`]="{item}">
                  <v-btn
                    fab
                    color="primary"
                    x-small
                    @click="openDialogEditIntegrantes(item)"
                  >
                    <v-icon>
                      mdi-account-multiple-plus
                    </v-icon>
                  </v-btn>
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
import DialogCreateComando from '~/components/DialogCreateComando'
import DialogEditComando from '~/components/DialogEditComando'
import DialogDeleteComando from '~/components/DialogDeleteComando'
import divisionesTerritoriales from '~/assets/divisionesTerritoriales.json'

export default {
  name: 'AdminSuperadmin',
  components: { DialogCreateComando, DialogDeleteComando, DialogEditComando },
  data () {
    return {
      editDialog: {
        dialog: false,
        comandoId: null
      },
      dialogCreate: false,
      table: {
        headers: [
          { text: 'Comando', value: 'comando', sortable: true },
          { text: 'Region', value: 'region', sortable: true },
          { text: 'Comuna', value: 'comuna', sortable: true },
          { text: 'Tematico', value: 'tematico', sortable: true },
          { text: 'Integrantes', value: 'integrantes', sortable: true },
          { text: 'Editar', value: 'editar', sortable: false }
        ],
        loading: false
      },
      comandos: [],
      deleteDialog: {
        dialog: false,
        comandoId: null,
        comando: ''
      },
      editIntegrantesDialog: {
        dialog: false,
        comandoId: null,
        comando: ''
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
    dialogCreate (val) {
      if (!val) {
        this.getComandos()
      }
    },
    'editDialog.dialog' (val) {
      if (!val) {
        this.getComandos()
      }
    },
    'deleteDialog.dialog' (val) {
      if (!val) {
        this.getComandos()
      }
    }
  },
  mounted () {
    if (!this.$auth.user.menus[0].submenus.some(el => el.route === '/admin-comandos')) {
      this.$router.push('error')
    }
    this.getComandos()
    this.setHeaders()
  },
  methods: {
    setHeaders () {
      if (this.$auth.user.superadmin) {
        this.table.headers.push(
          { text: 'Eliminar', value: 'eliminar', sortable: false }
        )
      }
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
      this.$axios.$get('admin-comandos')
        .then((response) => {
          this.comandos = response.comandos
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    openDialogEdit (comandoId) {
      this.editDialog.comandoId = comandoId
      this.editDialog.dialog = true
    },
    openDialogEditIntegrantes (comando) {
      this.editIntegrantesDialog.comandoId = comando.id
      this.editIntegrantesDialog.comando = comando.comando
      this.editIntegrantesDialog.dialog = true
    },
    openDialogDelete (comando) {
      this.deleteDialog.comandoId = comando.id
      this.deleteDialog.comando = comando.comando
      this.deleteDialog.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
