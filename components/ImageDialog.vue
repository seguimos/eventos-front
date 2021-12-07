<template>
  <v-dialog
    :value="value"
    width="600"
    @change="(e) => $emit('input', e)"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <v-card-title>
        <v-row justify="space-between">
          <v-col>
            Imagen Evento
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
      <v-img
        :src="url"
        height="338"
        aspect-ratio="16/9"
      />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ImageDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
