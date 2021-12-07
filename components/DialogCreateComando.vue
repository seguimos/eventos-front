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
              Crear Comando
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
          {{ error }}
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
              Agregar Comando
            </v-btn>
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import divisionesTerritoriales from '~/assets/divisionesTerritoriales.json'

export default {
  name: 'DialogCreateComando',
  props: {
    value: {
      type: Boolean,
      default: false
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
      error: ''
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
    value () {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    'comando.regionId' (val, oldVal) {
      if (val && oldVal !== val) {
        this.comando.comunaId = null
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
    storeComando () {
      const valid = this.$refs.comandoForm.validate()
      if (!valid) {
        return
      }
      const data = this.comando
      this.$axios.post('admin-comandos', data)
        .then(() => {
          this.state = 'success'
        })
        .catch((error) => {
          this.error = error.response.message
        })
    }
  }
}
</script>

<style scoped>

</style>
