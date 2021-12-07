<template>
  <v-row justify="center" align="center">
    <v-col cols="12" xl="10">
      <v-card elevation="0">
        <v-card-text>
          <Eventos />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Eventos from '~/components/Eventos'
export default {
  components: { Eventos },
  auth: false
}
</script>
