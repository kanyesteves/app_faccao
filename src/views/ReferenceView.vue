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
      <ListReference ref="listReferenceRef" />
    </div>
    <div class="botton-navbar">
      <Button
        label="Criar Referência"
        icon="pi pi-plus"
        @click="openCreateDialog"
        class="btn-create"
      />
    </div>

    <!-- Componente SaveReference com Dialog -->
    <SaveReference
      :show="showSaveDialog"
      @update:show="showSaveDialog = $event"
      @referenceCreated="handleReferenceCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavbarMenu from '@/global/components/NavbarMenu.vue'
import SaveReference from '@/pages/reference/SaveReference.vue'
import ListReference from '@/pages/reference/ListReference.vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useAuthStore } from '@/stores/authStore'

const showSaveDialog = ref(false)
const listReferenceRef = ref()
const authStore = useAuthStore()

const userInitial = computed(() => {
  const name = authStore.userName || authStore.userEmail
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const openCreateDialog = () => {
  showSaveDialog.value = true
}

const handleReferenceCreated = () => {
  // Recarrega a lista de referências
  if (listReferenceRef.value) {
    listReferenceRef.value.loadReferences()
  }
}
</script>

<style scoped lang="scss">
.reference-view {
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
