<template>
  <v-row justify="center" align="center">
    <DialogCreateSuperAdmin v-model="dialogCreate" />
    <DialogDeleteSuperAdmin
      v-model="dialogDelete"
      :email="eliminarEmail"
    />
    <v-col cols="12" md="10">
      <v-card>
        <v-card-title>
          Administrador de Administradores
        </v-card-title>
        <v-card-text>
          <v-row justify="end">
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="dialogCreate = true"
              >
                Agregar Administrador
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table
                :headers="table.headers"
                :items="superadmins"
                :loading="table.loading"
              >
                <template #[`item.eliminar`]="{item}">
                  <v-btn
                    fab
                    color="error"
                    x-small
                    @click="openDialogDelete(item.email)"
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
import DialogCreateSuperAdmin from '~/components/DialogCreateSuperAdmin'
import DialogDeleteSuperAdmin from '~/components/DialogDeleteSuperAdmin'
export default {
  name: 'AdminSuperadmin',
  components: { DialogDeleteSuperAdmin, DialogCreateSuperAdmin },
  data () {
    return {
      dialogCreate: false,
      table: {
        loading: false,
        headers: [
          { text: 'Correo', value: 'email', sortable: true },
          { text: 'Eliminar', value: 'eliminar', sortable: false }
        ]
      },
      superadmins: [],
      dialogDelete: false,
      eliminarEmail: ''
    }
  },
  watch: {
    dialogCreate (val) {
      if (!val) {
        this.getSuperAdmins()
      }
    },
    dialogDelete (val) {
      if (!val) {
        this.getSuperAdmins()
      }
    }
  },
  mounted () {
    if (!this.$auth.user.menus[0].submenus.some(el => el.route === '/admin-superadmin')) {
      this.$router.push('error')
    }
    this.getSuperAdmins()
  },
  methods: {
    getSuperAdmins () {
      this.table.loading = true
      this.$axios.$get('superadmin')
        .then((response) => {
          this.superadmins = response.superadmins
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    openDialogDelete (email) {
      this.eliminarEmail = email
      this.dialogDelete = true
    }
  }
}
</script>

<style scoped>

</style>
