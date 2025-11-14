<template>
  <Toast />
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Toast from 'primevue/toast'

export default defineComponent({
  name: 'App',
  components: {
    Toast
  }
})
</script>

<style lang="scss">
#app {
  /* padding: 0.8rem; */
  height: 100vh;
  background-color: #a4a4a41f;
  font-family: Avenir, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .p-menu-submenu-label {
    color: rgb(43, 43, 43);
    display: flex;
  }
}

body {
  margin: 0;
}
</style>
