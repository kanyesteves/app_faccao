<template>
  <div class="customer-view">
    <div class="header-navbar">
      <NavbarMenu />
      <Avatar
        :label="userInitial"
        shape="circle"
        class="user-avatar"
      />
    </div>
    <div class="content">
      <ListCustomer ref="listCustomerRef" @edit="handleEditCustomer" />
    </div>
    <div class="botton-navbar">
      <Button
        label="Criar Cliente"
        icon="pi pi-plus"
        @click="openCreateDialog"
        class="btn-create"
      />
    </div>

    <!-- Componente SaveCustomer com Dialog -->
    <SaveCustomer
      :show="showSaveDialog"
      :customerId="selectedCustomerId"
      @update:show="showSaveDialog = $event"
      @customerCreated="handleCustomerCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import NavbarMenu from '@/global/components/NavbarMenu.vue'
import SaveCustomer from '@/pages/customer/SaveCustomer.vue'
import ListCustomer from '@/pages/customer/ListCustomer.vue'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useAuthStore } from '@/stores/authStore'

const showSaveDialog = ref(false)
const selectedCustomerId = ref<number | null>(null)
const listCustomerRef = ref()
const authStore = useAuthStore()

const userInitial = computed(() => {
  const name = authStore.userName || authStore.userEmail
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const openCreateDialog = () => {
  selectedCustomerId.value = null
  showSaveDialog.value = true
}

const handleEditCustomer = (id: number) => {
  selectedCustomerId.value = id
  showSaveDialog.value = true
}

const handleCustomerCreated = () => {
  // Recarrega a lista de clientes
  if (listCustomerRef.value) {
    listCustomerRef.value.loadCustomers()
  }
}
</script>

<style scoped lang="scss">
.customer-view {
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
