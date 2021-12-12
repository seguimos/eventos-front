<template>
  <v-app dark>
    <NavBar />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      absolute
      app
    >
      <span class="footer-text">Desarrollado por el Equipo de Devs x Boric - <a class="link-footer" href="https://www.seguimos.cl/" target="_blank">Seguimos</a> &copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'Layout'
}
</script>
<style scoped>
.link-footer{
  text-decoration: none;
}

.footer-text{
  font-size: 12px
}
</style>
