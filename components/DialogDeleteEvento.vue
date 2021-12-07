<template>
  <v-dialog
    :value="value"
    width="600"
    @change="(e) => $emit('input', e)"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <div>
        <v-card-title>
          <v-row justify="space-between">
            <v-col>
              Eliminar Evento
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
          Evento {{ evento }} eliminado correctamente
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
            ¿Está seguro/a que desea eliminar el evento {{ evento }}?
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="warning"
              @click="deleteEvento"
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
  name: 'DialogDeleteComando',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    eventoId: {
      type: Number,
      default: null
    },
    evento: {
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
    deleteEvento () {
      this.$axios.$delete('admin-eventos/' + this.eventoId)
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
