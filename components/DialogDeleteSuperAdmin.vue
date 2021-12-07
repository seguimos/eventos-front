<template>
  <v-dialog
    :value="value"
    width="600"
    @change="(e) => $emit('input', e)"
  >
    <v-card :loading="loading">
      <div>
        <v-card-title>
          <v-row justify="space-between">
            <v-col>
              Eliminar Administrador
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
        <v-card-text v-if="state==='success'">
          {{ email }} eliminado correctamente
        </v-card-text>
        <v-card-text
          v-if="state === 'error'"
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
        <div v-if="state !== 'success'">
          <v-card-text>
            ¿Está seguro/a que desea eliminar a {{ email }} como administrador?
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="warning"
              @click="deleteAdmin"
            >
              Sí
            </v-btn>
          </v-card-actions>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { errorsToArray } from '~/utils'

export default {
  name: 'DialogDeleteSuperAdmin',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    email: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      state: null,
      errors: []
    }
  },
  methods: {
    deleteAdmin () {
      const data = {
        email: this.email
      }
      this.$axios.$delete('superadmin', { data })
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
