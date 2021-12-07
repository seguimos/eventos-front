<template>
  <v-dialog
    :value="value"
    width="600"
    @change="(e) => $emit('input', e)"
  >
    <v-card
      :loading="loading"
    >
      <div>
        <v-card-title>
          <v-row justify="space-between">
            <v-col>
              Crear Administrador
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
          Creado exitosamente
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
          ref="administradorForm"
          @submit.prevent="agregarAdminsitrador"
        >
          <v-card-text>
            <v-autocomplete
              v-model="email"
              label="Correo"
              :items="users"
              :search-input.sync="searchEmail"
              item-text="email"
              item-value="email"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              color="warning"
            >
              Agregar Administrador
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
  name: 'DialogCreateSuperAdmin',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      email: '',
      searchEmail: '',
      users: [],
      state: null,
      errors: []
    }
  },
  watch: {
    searchEmail (val) {
      setTimeout(() => {
        if (val === this.searchEmail) {
          this.searchUser(val)
        }
      }, 300)
    },
    value () {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  },
  methods: {
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
        this.users = response.data.users
      }).catch(() => {
        this.users = []
      })
    },
    agregarAdminsitrador () {
      const valid = this.$refs.administradorForm.validate()
      if (!valid) {
        return
      }
      this.loading = true
      const data = {
        email: this.email
      }
      this.$axios.post('superadmin', data)
        .then(() => {
          Object.assign(this.$data, this.$options.data.apply(this))
          this.state = 'success'
          this.loading = false
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
