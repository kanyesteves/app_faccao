<template>
  <div class="list-lot">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>

    <!-- Mensagem quando não há registros -->
    <div v-else-if="!loading && lots.length === 0" class="empty-state">
      <i class="pi pi-inbox empty-icon"></i>
      <h3>Nenhum lote cadastrado</h3>
      <p>Comece criando seu primeiro lote clicando no botão abaixo</p>
    </div>

    <!-- Lista de Cards -->
    <div v-else class="lot-cards">
      <Card v-for="lot in lots" :key="lot.id" class="lot-card">
        <template #header>
          <div class="card-header">
            <h3>Lote #{{ lot.number }}</h3>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <div class="info-row">
              <span class="label">Data de Criação:</span>
              <span class="value">{{ lot.createdAt }}</span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="card-actions">
            <Button
              icon="pi pi-pencil"
              severity="info"
              text
              @click="editLot(lot.id)"
            />
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              @click="deleteLot(lot.id)"
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
import { getLotsByOrganization, deleteLot as deleteLotService } from '@/services/lotService'

// Composables
const toast = useToast()

// Data
const lots = ref<any[]>([])
const loading = ref(false)

// Methods
const loadLots = async () => {
  loading.value = true

  try {
    const response = await getLotsByOrganization()

    if (response.success) {
      lots.value = response.data.map((lot: any) => ({
        id: lot.id,
        number: lot.number,
        createdAt: new Date(lot.created_at).toLocaleDateString('pt-BR')
      }))
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar lotes',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar lotes',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Emits
const emit = defineEmits(['edit'])

const editLot = (id: string) => {
  emit('edit', id)
}

const deleteLot = async (id: string) => {
  if (!confirm('Tem certeza que deseja deletar este lote?')) {
    return
  }

  try {
    const response = await deleteLotService(id)

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Lote deletado com sucesso!',
        life: 3000
      })

      // Recarrega a lista
      loadLots()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao deletar lote',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao deletar lote',
      life: 3000
    })
  }
}

// Lifecycle
onMounted(() => {
  loadLots()
})

// Expõe loadLots para o componente pai
defineExpose({
  loadLots
})
</script>

<style scoped lang="scss">
.list-lot {
  padding: 1rem;
  font-family: Avenir, Helvetica, sans-serif;
  height: 100%;
  overflow-y: auto;
}

.lot-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.lot-card {
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
