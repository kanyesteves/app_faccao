<template>
  <div class="home">
    <div class="header-navbar">

      <div class="header-box">
        <NavbarMenu />
        <Avatar
          :label="userInitial"
          shape="circle"
          class="user-avatar"
        />
      </div>

    </div>
    <div class="home-content">
      <h1>Noro App</h1>
      <p>Aplicativo de gestão de produção para faccionistas de costura</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import NavbarMenu from '@/global/components/NavbarMenu.vue';
import Avatar from 'primevue/avatar';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
  name: 'HomeView',
  components: {
    NavbarMenu,
    Avatar
  },
  setup() {
    const authStore = useAuthStore();

    const userInitial = computed(() => {
      const name = authStore.userName || authStore.userEmail;
      return name ? name.charAt(0).toUpperCase() : 'U';
    });

    return {
      userInitial
    };
  }
});
</script>

<style scoped>
.home {
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

.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}

.user-avatar {
  background-color: #b3a2d4 !important;
  color: #fff !important;
  font-weight: 600;
}

.home-content {
  padding: 2rem;
  margin-top: 60px;
}
</style>
