<template>
  <v-dialog
    :value="value"
    width="600"
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
              Editar Comando
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
          @submit.prevent="storeComando"
        >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="comando.comando"
                  label="Nombre Comando (*)"
                  :rules="[(v)=>!!v||'Requerido']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="comando.comandoTematico"
                  label="Comando Temático"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="comando.regionId"
                  :label="'Region' + (comando.comandoTematico? '':' (*)')"
                  item-value="id"
                  item-text="region"
                  clearable
                  :items="regiones"
                  :rules="[(v)=>comando.comandoTematico || !!v||'Requerido']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-model="comando.comunaId"
                  :label="'Comuna' + (comando.comandoTematico? '':' (*)')"
                  item-value="id"
                  item-text="comuna"
                  clearable
                  :items="comunas"
                  :rules="[(v)=>comando.comandoTematico || !!v||'Requerido']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="comando.facebookUrl"
                  label="Facebook URL"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="comando.instagramUrl"
                  label="Instagram URL"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="comando.twitterUrl"
                  label="Twitter URL"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="comando.tiktokUrl"
                  label="Tiktok URL"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="comando.email"
                  label="Correo de Contacto"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="comando.telefono"
                  label="Telefono de Contacto"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              color="primary"
            >
              Editar Comando
            </v-btn>
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import divisionesTerritoriales from '~/assets/divisionesTerritoriales.json'
import { errorsToArray } from '~/utils'

export default {
  name: 'DialogEditComando',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    comandoId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      comando: {
        comando: '',
        regionId: null,
        comunaId: null,
        comandoTematico: false,
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        tiktokUrl: '',
        email: '',
        telefono: ''
      },
      state: null,
      loading: false,
      errors: ''
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
      const regionId = this.comando.regionId
      return divisionesTerritoriales.reduce((acc, region) => {
        if (regionId && regionId !== region.id) {
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
    value (val) {
      Object.assign(this.$data, this.$options.data.apply(this))
      if (val) {
        this.getComando()
      }
    },
    'comando.regionId' (val, oldVal) {
      if (val && oldVal !== val) {
        const comunaEnRegion = this.comunas
          .some(el => el.regionId === val && this.comando.comunaId === el.id)
        if (!comunaEnRegion) {
          this.comando.comunaId = null
        }
      }
    },
    'comando.comunaId' (val) {
      if (val) {
        const comuna = this.comunas.find(comuna => comuna.id === val)
        this.comando.regionId = comuna.regionId
      }
    }
  },
  methods: {
    getComando () {
      this.$axios.$get(`admin-comandos/${this.comandoId}/edit`)
        .then((response) => {
          this.comando.comando = response.comando.comando
          this.comando.regionId = response.comando.regionId
          this.comando.comunaId = response.comando.comunaId
          this.comando.comandoTematico = response.comando.comandoTematico
          this.comando.facebookUrl = response.comando.facebookUrl
          this.comando.instagramUrl = response.comando.instagramUrl
          this.comando.twitterUrl = response.comando.twitterUrl
          this.comando.tiktokUrl = response.comando.tiktokUrl
          this.comando.email = response.comando.email
          this.comando.telefono = response.comando.telefono
        })
    },
    storeComando () {
      const valid = this.$refs.comandoForm.validate()
      if (!valid) {
        return
      }
      this.loading = true
      const data = this.comando
      this.$axios.put('admin-comandos/' + this.comandoId, data)
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
