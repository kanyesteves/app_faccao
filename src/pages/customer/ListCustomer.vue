<template>
  <div class="list-customer">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>

    <!-- Mensagem quando não há registros -->
    <div v-else-if="!loading && customers.length === 0" class="empty-state">
      <i class="pi pi-users empty-icon"></i>
      <h3>Nenhum cliente cadastrado</h3>
      <p>Comece adicionando seu primeiro cliente clicando no botão abaixo</p>
    </div>

    <!-- Lista de Cards -->
    <div v-else class="customer-cards">
      <Card v-for="customer in customers" :key="customer.id" class="customer-card">
        <template #header>
          <div class="card-header">
            <h3>{{ customer.name }}</h3>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <div class="info-row">
              <span class="label">Data de Criação:</span>
              <span class="value">{{ customer.createdAt }}</span>
            </div>
            <div v-if="customer.dayClose" class="info-row">
              <span class="label">Dia do Fechamento:</span>
              <span class="value">Dia {{ customer.dayClose }}</span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="card-actions">
            <Button
              icon="pi pi-pencil"
              severity="info"
              text
              @click="editCustomer(customer.id)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              @click="deleteCustomer(customer.id)"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import { getCustomersByOrganization, deleteCustomer as deleteCustomerService } from '@/services/customerService'

// Composables
const toast = useToast()

// Data
const customers = ref<any[]>([])
const loading = ref(false)

// Methods
const loadCustomers = async () => {
  loading.value = true

  try {
    const response = await getCustomersByOrganization()

    if (response.success) {
      customers.value = response.data.map((customer: any) => {
        return {
          id: customer.id,
          name: customer.name,
          dayClose: customer.date_close || null,
          createdAt: new Date(customer.created_at).toLocaleDateString('pt-BR')
        }
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar clientes',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar clientes',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Emits
const emit = defineEmits(['edit'])

const editCustomer = (id: number) => {
  emit('edit', id)
}

const deleteCustomer = async (id: number) => {
  if (!confirm('Tem certeza que deseja deletar este cliente?')) {
    return
  }

  try {
    const response = await deleteCustomerService(id)

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Cliente deletado com sucesso!',
        life: 3000
      })

      // Recarrega a lista
      loadCustomers()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao deletar cliente',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao deletar cliente',
      life: 3000
    })
  }
}

// Lifecycle
onMounted(() => {
  loadCustomers()
})

// Expõe loadCustomers para o componente pai
defineExpose({
  loadCustomers
})
</script>

<style scoped lang="scss">
.list-customer {
  padding: 1rem;
  font-family: Avenir, Helvetica, sans-serif;
  height: 100%;
  overflow-y: auto;
}

.customer-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.customer-card {
  font-family: Avenir, Helvetica, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;

  h3 {
    margin: 0;
    font-family: Avenir, Helvetica, sans-serif;
    font-size: 1.2rem;
    color: #2c3e50;
  }
}

.card-content {
  padding: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: 600;
    color: #6c757d;
  }

  .value {
    color: #2c3e50;
    font-weight: 500;
  }
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-top: 1px solid #dee2e6;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
  color: #6c757d;

  .empty-icon {
    font-size: 4rem;
    color: #b3a2d4;
    margin-bottom: 1rem;
  }

  h3 {
    font-family: Avenir, Helvetica, sans-serif;
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    font-family: Avenir, Helvetica, sans-serif;
    font-size: 1rem;
    color: #6c757d;
    max-width: 400px;
  }
}
</style>
