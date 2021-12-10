<template>
  <v-dialog
    :value="value"
    width="600"
    @change="(e) => $emit('input', e)"
    @click:outside="$emit('input', false)"
  >
    <ImageDialog
      v-model="imageDialog"
      :url="evento.imageUrl"
    />
    <v-card>
      <div>
        <v-card-title>
          <v-row justify="space-between">
            <v-col>
              {{ eventoId? 'Editar': 'Crear' }} evento
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
          {{ eventoId? 'Editado': 'Creado' }} exitosamente
        </v-card-text>
        <v-card-text
          v-else-if="state === 'error'"
        >
          {{ error }}
        </v-card-text>
        <v-form
          v-else
          ref="eventoForm"
          @submit.prevent="saveEvento"
        >
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="py-1">
                <v-text-field
                  v-model="evento.evento"
                  label="Nombre Evento (*)"
                  :rules="[(v)=>!!v||'Requerido']"
                />
              </v-col>
              <v-col cols="12" md="6" class="py-1">
                <v-autocomplete
                  v-model="evento.comandoId"
                  label="Comando (*)"
                  :rules="[(v)=>!!v||'Requerido']"
                  :items="comandos"
                  item-text="comando"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12" class="py-1">
                <v-textarea
                  v-model="evento.descripcion"
                  label="Descripción (*)"
                  rows="3"
                  :rules="[(v)=>!!v||'Requerido']"
                />
              </v-col>
              <v-col cols="12" md="6" class="py-1">
                <v-menu
                  v-model="menuDateStart"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      :value="formatDate(evento.dateStart)"
                      label="Fecha de Inicio (*)"
                      hint="DD/MM/AAAA"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      :rules="[(v)=>!!v||'Requerido']"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="evento.dateStart"
                    no-title
                    @input="menuDateStart = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-1"
              >
                <v-menu
                  ref="menuTimeStart"
                  v-model="menuTimeStart"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="evento.timeStart"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="evento.timeStart"
                      label="Hora de Inicio (*)"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      :rules="[(v)=>!!v||'Requerido']"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="menuTimeStart"
                    v-model="evento.timeStart"
                    full-width
                    ampm-in-title
                    scrollable
                    :allowed-minutes="allowedStep"
                    @click:minute="$refs.menuTimeStart.save(evento.timeStart)"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" md="6" class="py-1">
                <v-menu
                  v-model="menuDateEnd"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      :value="formatDate(evento.dateEnd)"
                      label="Fecha de Término (*)"
                      hint="DD/MM/AAAA"
                      persistent-hint
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      :rules="[(v)=>!!v||'Requerido']"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="evento.dateEnd"
                    no-title
                    @input="menuDateEnd = false"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-1"
              >
                <v-menu
                  ref="menuTimeEnd"
                  v-model="menuTimeEnd"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="evento.timeEnd"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="evento.timeEnd"
                      label="Hora de Término (*)"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      :rules="[(v)=>!!v||'Requerido']"
                      v-on="on"
                    />
                  </template>
                  <v-time-picker
                    v-if="menuTimeEnd"
                    v-model="evento.timeEnd"
                    full-width
                    ampm-in-title
                    scrollable
                    :allowed-minutes="allowedStep"
                    @click:minute="$refs.menuTimeEnd.save(evento.timeEnd)"
                  />
                </v-menu>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-1"
              >
                <v-select
                  v-model="evento.regionId"
                  label="Region"
                  item-value="id"
                  item-text="region"
                  clearable
                  :items="regiones"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-1"
              >
                <v-autocomplete
                  v-model="selectComunaId"
                  label="Comuna"
                  item-value="id"
                  item-text="comuna"
                  :items="comunas"
                  @change="changeComunaId()"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-1"
              >
                <v-text-field
                  v-model="evento.direccion"
                  label="Dirección (*)"
                  :rules="[(v)=>!!v||'Requerido']"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="py-1"
              >
                <v-file-input
                  v-model="evento.imageFile"
                  label="Imagen (*)"
                  accept="image/*"
                  :rules="[(v)=>!!v || !!eventoId||'Requerido']"
                  prepend-icon="mdi-image"
                >
                  <template v-if="evento.imageUrl" #append>
                    <v-icon @click="imageDialog=true">
                      mdi-eye
                    </v-icon>
                  </template>
                </v-file-input>
              </v-col>
              <v-col
                cols="12"
                class="py-1"
              >
                <MapaCreateEvento
                  v-if="showMap"
                  ref="mapaCreateEvento"
                  :lat.sync="evento.latitud"
                  :lng.sync="evento.longitud"
                  :region-id.sync="evento.regionId"
                  :comuna-id.sync="evento.comunaId"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              type="submit"
              color="primary"
            >
              {{ eventoId? 'Actualizar': 'Crear' }} Evento
            </v-btn>
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import divisionesTerritoriales from '~/assets/divisionesTerritoriales.json'
import { formatDate } from '~/utils'

export default {
  name: 'DialogCreateEditEvento',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    eventoId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      formatDate,
      menuDateStart: false,
      menuDateEnd: false,
      menuTimeStart: false,
      menuTimeEnd: false,
      imageDialog: false,
      evento: {
        evento: '',
        descripcion: '',
        regionId: null,
        comunaId: null,
        comandoId: null,
        direccion: '',
        latitud: 0,
        longitud: 0,
        dateStart: '',
        timeStart: '',
        dateEnd: '',
        timeEnd: '',
        imageFile: null,
        facebookUrl: '',
        instagramUrl: '',
        imageUrl: ''
      },
      comandos: [],
      state: null,
      error: '',
      showMap: false,
      selectComunaId: null
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
      const regionId = this.evento.regionId
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
    'evento.imageFile' (val, oldVal) {
      if (oldVal) {
        URL.revokeObjectURL(this.evento.imageUrl)
      }
      if (val) {
        this.evento.imageUrl = URL.createObjectURL(this.evento.imageFile)
      }
    },
    value (val) {
      if (val) {
        Object.assign(this.$data, this.$options.data.apply(this))
        this.initCreateEdit()
        this.$nextTick(() => {
          this.$refs.eventoForm.resetValidation()
        })
      } else {
        this.showMap = false
      }
    },
    'evento.regionId' (val, oldVal) {
      if (val && oldVal !== val) {
        if (this.evento.comunaId) {
          const comuna = this.comunas.find(comuna => comuna.id === this.evento.comunaId)
          if (!comuna || comuna.regionId !== val) {
            this.evento.comunaId = null
          }
        }
      }
    },
    'evento.comunaId' (val) {
      this.selectComunaId = val
      if (val) {
        const comuna = this.comunas.find(comuna => comuna.id === val)
        if (this.evento.regionId !== comuna.regionId) {
          this.evento.regionId = comuna.regionId
        }
      }
    },
    'evento.comandoId' (val) {
      if (val) {
        const comando = this.comandos.find(comando => comando.id === val)
        if (this.evento.comunaId !== comando.comunaId) {
          this.evento.comunaId = comando.comunaId
        }
      }
    }
  },
  methods: {
    changeComunaId () {
      if (this.selectComunaId) {
        this.evento.comunaId = this.selectComunaId
      } else {
        this.selectComunaId = this.evento.comunaId
      }
    },
    initCreateEdit () {
      if (this.eventoId) {
        this.initEdit()
      } else {
        this.initCreate()
      }
    },
    initCreate () {
      this.$axios.$get('admin-eventos/create')
        .then((response) => {
          this.comandos = response.comandos
          this.$nextTick(() => {
            this.showMap = true
          })
        })
    },
    initEdit () {
      this.$axios.$get(`admin-eventos/${this.eventoId}/edit`)
        .then((response) => {
          this.comandos = response.comandos
          const evento = response.evento
          this.evento.evento = evento.evento
          this.evento.evento = evento.evento
          this.evento.descripcion = evento.descripcion
          this.evento.comandoId = evento.comandoId
          this.evento.regionId = evento.regionId
          this.evento.comunaId = evento.comunaId
          this.evento.direccion = evento.direccion
          const dateTimeStartArray = evento.dateTimeStart.split(' ')
          const dateTimeEndArray = evento.dateTimeEnd.split(' ')
          this.evento.dateStart = dateTimeStartArray[0]
          this.evento.timeStart = dateTimeStartArray[1].slice(0, -3)
          this.evento.dateEnd = dateTimeEndArray[0]
          this.evento.timeEnd = dateTimeEndArray[1].slice(0, -3)
          this.evento.facebookUrl = evento.facebookUrl
          this.evento.instagramUrl = evento.instagramUrl
          this.evento.imageUrl = evento.imageUrl
          this.evento.latitud = evento.latitud
          this.evento.longitud = evento.longitud
          this.$nextTick(() => {
            this.showMap = true
          })
        })
    },
    async getFileFromUrl (url, name, defaultType = 'image/jpeg') {
      return await this.$axios.get(url).then(async (response) => {
        const data = await response.blob()
        return new File([data], name, {
          type: data.type || response.headers.get('content-type') || defaultType
        })
      })
    },
    saveEvento () {
      const valid = this.$refs.eventoForm.validate()
      if (!valid) {
        return
      }
      const evento = this.evento
      const formData = new FormData()
      formData.append('evento', evento.evento)
      formData.append('descripcion', evento.descripcion)
      formData.append('regionId', evento.regionId)
      formData.append('comunaId', evento.comunaId)
      formData.append('comandoId', evento.comandoId)
      formData.append('direccion', evento.direccion)
      formData.append('latitud', evento.latitud)
      formData.append('longitud', evento.longitud)
      formData.append('dateTimeStart', evento.dateStart + ' ' + evento.timeStart)
      formData.append('dateTimeEnd', evento.dateEnd + ' ' + evento.timeEnd)
      formData.append('imageFile', evento.imageFile)
      formData.append('facebookUrl', evento.facebookUrl)
      formData.append('instagramUrl', evento.instagramUrl)
      if (this.eventoId) {
        this.updateEvento(this.eventoId, formData)
      } else {
        this.storeEvento(formData)
      }
    },
    storeEvento (data) {
      this.$axios.post('admin-eventos', data)
        .then(() => {
          this.state = 'success'
        })
        .catch((error) => {
          this.error = error.response.message
        })
    },
    updateEvento (eventoId, data) {
      data.append('_method', 'PUT')
      this.$axios.post('admin-eventos/' + eventoId, data)
        .then(() => {
          this.state = 'success'
        })
        .catch((error) => {
          this.error = error.response.message
        })
    },
    allowedStep: m => m % 15 === 0
  }
}
</script>

<style scoped>

</style>
