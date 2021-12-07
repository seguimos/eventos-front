<template>
  <v-dialog
    :value="value"
    width="800"
    @change="(e) => $emit('input', e)"
    @click:outside="$emit('input', false)"
  >
    <v-card
      :loading="loading"
    >
      <div>
        <v-card-title>
          <v-row justify="space-between">
            <v-col>
              Editar Integrantes Comando {{ comando }}
            </v-col>
            <v-col cols="auto">
              <v-icon
                @click="$emit('input', false)"
              >
                mdi-close
              </v-icon>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text
          v-if="state === 'success'"
        >
          Editado exitosamente
        </v-card-text>
        <v-card-text
          v-else-if="state === 'error'"
        >
          <ul>
            <li
              v-for="(error, index) in errors"
              :key="index"
            >
              {{ error }}
            </li>
          </ul>
        </v-card-text>
        <v-form
          v-else
          ref="comandoForm"
          @submit.prevent="storeIntegrantesComando()"
        >
          <v-card-text>
            Agregar Usuario
            <v-divider />
            <v-form
              ref="addIntegranteForm"
              lazy-validation
            >
              <v-autocomplete
                v-model="search.user"
                label="Correo"
                :items="search.users"
                :search-input.sync="search.email"
                item-text="email"
                return-object
                :rules="[(v) => userNotInIntegrantes(v) || 'Ya se encuentra en integrantes']"
              >
                <template #append-outer>
                  <v-btn
                    fab
                    color="primary"
                    x-small
                    :disabled="!Object.hasOwnProperty.call(search.user, 'email')"
                    @click="addIntegrante()"
                  >
                    <v-icon>
                      mdi-account-plus
                    </v-icon>
                  </v-btn>
                </template>
              </v-autocomplete>
            </v-form>
            Usuarios Comando
            <v-divider />
            <v-data-table
              :headers="table.headers"
              :items="integrantes"
              :loading="table.loading"
            >
              <template #[`item.admin`]="{item}">
                <v-switch
                  v-model="item.admin"
                  :input-value="item.admin"
                  @change="(e) => item.editor = e"
                />
              </template>
              <template #[`item.editor`]="{item}">
                <v-switch
                  v-model="item.editor"
                  :input-value="item.editor"
                />
              </template>
              <template #[`item.eliminar`]="{item}">
                <v-btn
                  fab
                  color="error"
                  x-small
                  @click="deleteIntegrante(item)"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              color="primary"
            >
              Guardar Integrantes Comando
            </v-btn>
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>

import { errorsToArray } from '~/utils'

export default {
  name: 'DialogEditIntegrantesComando',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    comandoId: {
      type: Number,
      default: null
    },
    comando: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      search: {
        email: '',
        user: {},
        users: []
      },
      integrantes: [],
      deletedIntegrantesIds: [],
      state: null,
      errors: [],
      table: {
        loading: false,
        headers: [
          { text: 'Correo', value: 'email', sortable: true },
          { text: 'Nombre', value: 'nombre', sortable: true },
          { text: 'Primer Apellido', value: 'primerApellido', sortable: true },
          { text: 'Segundo Apellido', value: 'segundoApellido', sortable: true },
          { text: 'Administrador', value: 'admin', sortable: false },
          { text: 'Editor', value: 'editor', sortable: false },
          { text: 'Eliminar', value: 'eliminar', sortable: false }
        ]
      }
    }
  },
  watch: {
    'search.email' (val) {
      setTimeout(() => {
        if (val === this.search.email) {
          this.searchUser(val)
        }
      }, 300)
    },
    value (val) {
      Object.assign(this.$data, this.$options.data.apply(this))
      if (val) {
        this.getIntegrantesComando()
      }
    }
  },
  methods: {
    userNotInIntegrantes (user) {
      if (Object.hasOwnProperty.call(user, 'email')) {
        return !this.integrantes.some(integrante => integrante.email === user.email)
      } else {
        return true
      }
    },
    searchUser (email) {
      if (!email) {
        return
      }
      const params = {
        email
      }
      this.$axios.get('search-user', {
        params
      }).then((response) => {
        this.search.users = response.data.users
      }).catch(() => {
        this.search.users = []
      })
    },
    getIntegrantesComando () {
      this.table.loading = true
      this.$axios.$get('integrantes-comando/' + this.comandoId)
        .then((response) => {
          this.integrantes = response.integrantes
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    addIntegrante () {
      const valid = this.$refs.addIntegranteForm.validate()
      if (!valid) {
        return
      }
      const userTemp = this.search.user
      const user = {
        userId: userTemp.id,
        email: userTemp.email,
        nombre: userTemp.nombre,
        primerApellido: userTemp.primerApellido,
        segundoApellido: userTemp.segundoApellido,
        admin: false,
        editor: false
      }
      this.integrantes.push(user)
    },
    deleteIntegrante (item) {
      const userId = item.userId
      this.integrantes = this.integrantes.filter(integrante => integrante.userId !== userId)
      if (Object.hasOwnProperty.call(item, 'id')) {
        this.deletedIntegrantesIds.push(item.id)
      }
    },
    storeIntegrantesComando () {
      this.loading = true
      const data = {
        integrantes: this.integrantes,
        deletedIntegrantesIds: this.deletedIntegrantesIds
      }
      this.$axios.put('integrantes-comando/' + this.comandoId, data)
        .then(() => {
          this.state = 'success'
        })
        .catch((error) => {
          this.state = 'error'
          this.errors = errorsToArray(error.response.data)
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>

</style>
