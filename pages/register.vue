<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="8" lg="6">
      <v-card>
        <v-card-title>
          Registrarse
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
              v-model="nombre"
              label="Nombre"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="primerApellido"
              label="Primer Apellido"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="segundoApellido"
              label="Segundo Apellido"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="password"
              type="password"
              label="Contraseña"
              :rules="[(v) => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="passwordRepeat"
              type="password"
              label="Contraseña"
              :rules="[
                ((v) => !!v || 'Requerido'),
                ((v)=> v === password || 'Contraseñas no coinciden')
              ]"
            />
            <v-btn
              color="primary"
              type="submit"
            >
              Registrar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Register',
  auth: false,
  data () {
    return {
      email: '',
      password: '',
      passwordRepeat: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: ''
    }
  },
  methods: {
    login () {
      const valid = this.$refs.loginForm.validate()
      if (!valid) {
        return
      }
      const data = {
        email: this.email,
        password: this.password,
        nombre: this.nombre,
        primerApellido: this.primerApellido,
        segundoApellido: this.segundoApellido
      }
      this.$axios.$post('auth/register', data)
        .then(() => {
          this.$router.push('login')
        })
    }
  }
}
</script>

<style scoped>

</style>
