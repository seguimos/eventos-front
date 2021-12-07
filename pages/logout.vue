<template>
  <div>
    Cerrando Sesión
  </div>
</template>

<script>
export default {
  name: 'Logout',
  mounted () {
    this.$auth.logout().then(() => {
      this.$router.push('/')
    })
  }
}
</script>

<style scoped>

</style>
