<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="8" lg="6">
      <v-card>
        <v-card-title>
          Inicio de Sesión
        </v-card-title>
        <v-card-text>
          <v-form
            ref="loginForm"
            lazy-validation
            @submit.prevent="login"
          >
            <v-text-field
              v-model="email"
              label="Correo electrónico"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="password"
              type="password"
              label="Contraseña"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-btn
              color="primary"
              type="submit"
            >
              Iniciar Sesion
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Login',
  auth: 'guest',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      const valid = this.$refs.loginForm.validate()
      if (!valid) {
        return
      }
      this.$auth.loginWith('laravelJWT', {
        data: {
          email: this.email,
          password: this.password
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
