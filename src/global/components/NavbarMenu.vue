<template>
  <div>
    <!-- Botão para abrir o drawer -->
    <Button
      icon="pi pi-bars"
      @click="visible = true"
      severity="secondary"
      text
      rounded
    />

    <!-- Drawer Sidebar -->
    <Drawer v-model:visible="visible" header="Menu">
      <div class="navbar-content">
        <!-- Logo/Header -->
        <div class="navbar-header">
          <h3>Noro App</h3>
        </div>

        <!-- Menu Items -->
        <nav class="navbar-menu">
          <router-link
            to="/"
            class="menu-item"
            @click="visible = false"
          >
            <i class="pi pi-home"></i>
            <span>Home</span>
          </router-link>

          <router-link
            to="/references"
            class="menu-item"
            @click="visible = false"
          >
            <i class="pi pi-book"></i>
            <span>Referências</span>
          </router-link>

          <router-link
            to="/customers"
            class="menu-item"
            @click="visible = false"
          >
            <i class="pi pi-users"></i>
            <span>Clientes</span>
          </router-link>

          <router-link
            to="/lots"
            class="menu-item"
            @click="visible = false"
          >
            <i class="pi pi-box"></i>
            <span>Lotes</span>
          </router-link>

          <router-link
            to="/type-services"
            class="menu-item"
            @click="visible = false"
          >
            <i class="pi pi-cog"></i>
            <span>Tipos de Serviço</span>
          </router-link>

          <!-- <router-link
            to="/users"
            class="menu-item"
            @click="visible = false"
          >
            <i class="pi pi-user"></i>
            <span>Usuários</span>
          </router-link> -->

          <router-link
            to="/organization"
            class="menu-item"
            @click="visible = false"
          >
            <i class="pi pi-building"></i>
            <span>Organização</span>
          </router-link>

          <div class="menu-divider"></div>

          <a
            href="#"
            class="menu-item logout"
            @click.prevent="handleLogout"
          >
            <i class="pi pi-sign-out"></i>
            <span>Sair</span>
          </a>
        </nav>
      </div>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'

const visible = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  visible.value = false
  router.push('/login')
}
</script>

<style scoped lang="scss">
.navbar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Avenir, Helvetica, sans-serif;
}

.navbar-header {
  padding: 1rem 0 2rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.5rem;
    font-family: Avenir, Helvetica, sans-serif;
  }
}

.navbar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-family: Avenir, Helvetica, sans-serif;

  i {
    font-size: 1.2rem;
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    font-family: Avenir, Helvetica, sans-serif;
  }

  &:hover {
    background-color: #f5f5f5;
    color: #1976d2;
  }

  &.router-link-active {
    background-color: #e3f2fd;
    color: #1976d2;
    font-weight: 600;
  }

  &.logout {
    color: #d32f2f;

    &:hover {
      background-color: #ffebee;
      color: #c62828;
    }
  }
}

.menu-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 1rem 0;
}
</style>
