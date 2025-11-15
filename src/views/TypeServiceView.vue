<template>
  <div class="type-service-view">
    <div class="header-navbar">
      <NavbarMenu />
    </div>
    <div class="content">
      <h1>Tipos de Serviço</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavbarMenu from '@/global/components/NavbarMenu.vue'
// Componente será implementado posteriormente
</script>

<style scoped lang="scss">
.type-service-view {
  padding: 0;
}

.header-navbar {
  display: flex;
  justify-content: start;
  background-color: #2f1c6a;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  padding: 2rem;
  margin-top: 60px;
}
</style>
