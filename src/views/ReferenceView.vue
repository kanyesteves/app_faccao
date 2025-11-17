<template>
  <div class="reference-view">
    <div class="header-navbar">
      <NavbarMenu />
      <Avatar
        :label="userInitial"
        shape="circle"
        class="user-avatar"
      />
    </div>
    <div class="content">
      <h1>Referências</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NavbarMenu from '@/global/components/NavbarMenu.vue'
import Avatar from 'primevue/avatar'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const userInitial = computed(() => {
  const name = authStore.userName || authStore.userEmail
  return name ? name.charAt(0).toUpperCase() : 'U'
})
</script>

<style scoped lang="scss">
.reference-view {
  padding: 0;
}

.header-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2f1c6a;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  background-color: #b3a2d4 !important;
  color: #fff !important;
  font-weight: 600;
}

.content {
  padding: 2rem;
  margin-top: 60px;
}
</style>
