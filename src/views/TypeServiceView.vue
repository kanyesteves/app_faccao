<template>
  <div class="type-service-view">
    <div class="header-navbar">
      <NavbarMenu />
      <Avatar
        :label="userInitial"
        shape="circle"
        class="user-avatar"
      />
    </div>
    <div class="content">
      <ListTypeService ref="listTypeServiceRef" />
    </div>
    <div class="botton-navbar">
      <Button
        label="Criar Tipo de Serviço"
        icon="pi pi-plus"
        @click="openCreateDialog"
        class="btn-create"
      />
    </div>

    <!-- Componente SaveTypeService com Dialog -->
    <SaveTypeService
      :show="showSaveDialog"
      @update:show="showSaveDialog = $event"
      @typeServiceCreated="handleTypeServiceCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavbarMenu from '@/global/components/NavbarMenu.vue'
import SaveTypeService from '@/pages/type-service/SaveTypeService.vue'
import ListTypeService from '@/pages/type-service/ListTypeService.vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useAuthStore } from '@/stores/authStore'

const showSaveDialog = ref(false)
const listTypeServiceRef = ref()
const authStore = useAuthStore()

const userInitial = computed(() => {
  const name = authStore.userName || authStore.userEmail
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const openCreateDialog = () => {
  showSaveDialog.value = true
}

const handleTypeServiceCreated = () => {
  // Recarrega a lista de tipos de serviço
  if (listTypeServiceRef.value) {
    listTypeServiceRef.value.loadTypeServices()
  }
}
</script>

<style scoped lang="scss">
.type-service-view {
  padding: 0;
  height: 100vh;
  overflow: hidden;
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

.botton-navbar {
  display: flex;
  justify-content: center;
  background-color: #2f1c6a;
  padding: 10px 20px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.content {
  padding: 0;
  height: calc(100vh - 120px);
  margin-top: 60px;
  overflow: hidden;
}

.btn-create {
  background-color: #b3a2d4 !important;
  border-color: #b3a2d4 !important;
  color: #fff !important;

  &:hover {
    background-color: #9f8ac4 !important;
    border-color: #9f8ac4 !important;
  }
}
</style>
