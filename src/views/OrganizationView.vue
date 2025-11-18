<template>
  <div class="organization-view">
    <div class="header-navbar">
      <NavbarMenu />
      <Avatar
        :label="userInitial"
        shape="circle"
        class="user-avatar"
      />
    </div>
    <div class="content">
      <!-- Loading Spinner -->
      <div v-if="loading" class="loading-container">
        <ProgressSpinner />
      </div>

      <!-- Formulário de Organização -->
      <div v-else class="organization-form">
        <h2 class="form-title">Minha Organização</h2>

        <form @submit.prevent="handleSubmit">
          <div class="form-field">
            <label for="organizationName">Nome da Organização</label>
            <InputText
              id="organizationName"
              v-model="organizationData.name"
              placeholder="Digite o nome da organização"
              :class="{ 'p-invalid': submitted && !organizationData.name }"
            />
            <small v-if="submitted && !organizationData.name" class="p-error">
              Nome da organização é obrigatório
            </small>
          </div>

          <div class="form-field">
            <label for="organizationEmail">E-mail</label>
            <InputText
              id="organizationEmail"
              v-model="organizationData.email"
              placeholder="Digite o e-mail"
              type="email"
              :class="{ 'p-invalid': submitted && !organizationData.email }"
            />
            <small v-if="submitted && !organizationData.email" class="p-error">
              E-mail é obrigatório
            </small>
          </div>

          <div class="form-field">
            <label for="organizationCnpj">CNPJ</label>
            <InputText
              id="organizationCnpj"
              v-model="organizationData.cnpj"
              placeholder="Digite o CNPJ"
              :class="{ 'p-invalid': submitted && !organizationData.cnpj }"
            />
            <small v-if="submitted && !organizationData.cnpj" class="p-error">
              CNPJ é obrigatório
            </small>
          </div>

          <div class="form-field">
            <label for="organizationPlan">Plano</label>
            <InputText
              id="organizationPlan"
              v-model="organizationData.plan"
              placeholder="Digite o plano"
              :class="{ 'p-invalid': submitted && !organizationData.plan }"
            />
            <small v-if="submitted && !organizationData.plan" class="p-error">
              Plano é obrigatório
            </small>
          </div>
        </form>
      </div>
    </div>
    <div class="botton-navbar">
      <Button
        label="Salvar"
        icon="pi pi-save"
        @click="handleSubmit"
        :loading="saving"
        class="btn-save"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NavbarMenu from '@/global/components/NavbarMenu.vue'
import Avatar from 'primevue/avatar'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/authStore'
import { getOrganizationByUser, updateOrganization } from '@/services/organizationService'

const authStore = useAuthStore()
const toast = useToast()

// Data
const loading = ref(false)
const saving = ref(false)
const submitted = ref(false)
const organizationId = ref<number | null>(null)
const organizationData = ref({
  name: '',
  email: '',
  cnpj: '',
  plan: ''
})

// Computed
const userInitial = computed(() => {
  const name = authStore.userName || authStore.userEmail
  return name ? name.charAt(0).toUpperCase() : 'U'
})

// Methods
const loadOrganization = async () => {
  loading.value = true

  try {
    const response = await getOrganizationByUser()

    if (response.success && response.data) {
      organizationId.value = response.data.id || null
      organizationData.value = {
        name: response.data.name,
        email: response.data.email,
        cnpj: response.data.cnpj,
        plan: response.data.plan
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar organização',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar organização',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitted.value = true

  // Validação
  if (
    !organizationData.value.name.trim() ||
    !organizationData.value.email.trim() ||
    !organizationData.value.cnpj.trim() ||
    !organizationData.value.plan.trim()
  ) {
    return
  }

  if (!organizationId.value) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'ID da organização não encontrado',
      life: 3000
    })
    return
  }

  saving.value = true

  try {
    const response = await updateOrganization(organizationId.value, {
      name: organizationData.value.name.trim(),
      email: organizationData.value.email.trim(),
      cnpj: organizationData.value.cnpj.trim(),
      plan: organizationData.value.plan.trim()
    })

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Organização atualizada com sucesso!',
        life: 3000
      })
      submitted.value = false
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao atualizar organização',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao atualizar organização',
      life: 3000
    })
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadOrganization()
})
</script>

<style scoped lang="scss">
.organization-view {
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

.content {
  padding: 2rem;
  height: calc(100vh - 120px);
  margin-top: 60px;
  overflow-y: auto;
  background-color: #f8f9fa;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400px;
}

.organization-form {
  max-width: 600px;
  margin: 0 auto;
  font-family: Avenir, Helvetica, sans-serif;

  .form-title {
    font-family: Avenir, Helvetica, sans-serif;
    font-size: 1.75rem;
    color: #2c3e50;
    margin: 0 0 2rem 0;
    font-weight: 600;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: left;

    label {
      font-weight: 600;
      color: #2c3e50;
      font-family: Avenir, Helvetica, sans-serif;
      text-align: left;
      font-size: 0.95rem;
    }

    .p-error {
      color: #e24c4c;
      font-size: 0.875rem;
      text-align: left;
    }
  }
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

.btn-save {
  background-color: #b3a2d4 !important;
  border-color: #b3a2d4 !important;
  color: #fff !important;

  &:hover {
    background-color: #9f8ac4 !important;
    border-color: #9f8ac4 !important;
  }
}
</style>
