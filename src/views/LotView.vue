<template>
  <div class="lot-view">
    <div class="header-navbar">
      <NavbarMenu />
      <Avatar
        :label="userInitial"
        shape="circle"
        class="user-avatar"
      />
    </div>
    <div class="content">
      <ListLot ref="listLotRef" />
    </div>
    <div class="botton-navbar">
      <Button
        label="Criar Lote"
        icon="pi pi-plus"
        @click="openCreateDialog"
        class="btn-create"
      />
    </div>

    <!-- Componente SaveLot com Dialog -->
    <SaveLot
      :show="showSaveDialog"
      @update:show="showSaveDialog = $event"
      @lotCreated="handleLotCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavbarMenu from '@/global/components/NavbarMenu.vue'
import SaveLot from '@/pages/lot/SaveLot.vue'
import ListLot from '@/pages/lot/ListLot.vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useAuthStore } from '@/stores/authStore'

const showSaveDialog = ref(false)
const listLotRef = ref()
const authStore = useAuthStore()

const userInitial = computed(() => {
  const name = authStore.userName || authStore.userEmail
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const openCreateDialog = () => {
  showSaveDialog.value = true
}

const handleLotCreated = () => {
  // Recarrega a lista de lotes
  if (listLotRef.value) {
    listLotRef.value.loadLots()
  }
}
</script>

<style scoped lang="scss">
.lot-view {
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
