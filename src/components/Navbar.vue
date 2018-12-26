<template lang="pug">
  nav.navbar.navbar-expand-lg.navbar-dark.bg-dark
    router-link.navbar-brand(to="/") Teakozi Editor
    .collapse.navbar-collapse
      ul.navbar-nav.mr-auto
        //li.nav-item
          router-link.nav-link(to="/tests") Tests
        li.nav-item
          router-link.nav-link(to="/logview") Log View
</template>

<script>
export default {};
</script>

<style lang="css">
</style>
