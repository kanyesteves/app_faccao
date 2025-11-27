<template>
  <div class="list-reference">
    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
    </div>

    <!-- Mensagem quando não há registros -->
    <div v-else-if="!loading && references.length === 0" class="empty-state">
      <i class="pi pi-book empty-icon"></i>
      <h3>Nenhuma referência cadastrada</h3>
      <p>Comece adicionando sua primeira referência clicando no botão abaixo</p>
    </div>

    <!-- Lista de Cards -->
    <div v-else class="reference-cards">
      <Card v-for="reference in references" :key="reference.id" class="reference-card">
        <template #header>
          <div class="card-header">
            <h3>{{ reference.code }} - {{ reference.name }}</h3>
            <span class="total-value">{{ formatCurrency(reference.totalValue) }}</span>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <div class="info-row">
              <span class="label">Cor:</span>
              <span class="value">{{ reference.color }}</span>
            </div>
            <div class="info-row">
              <span class="label">Cliente:</span>
              <span class="value">{{ reference.customerName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Lote:</span>
              <span class="value">{{ reference.lotNumber }}</span>
            </div>
            <div class="info-row">
              <span class="label">Tipo de Serviço:</span>
              <span class="value">{{ reference.serviceTypeName }}</span>
            </div>
            <div class="info-row">
              <span class="label">Tamanho:</span>
              <span class="value" v-html="reference.size"></span>
            </div>
            <div class="info-row">
              <span class="label">Quantidade:</span>
              <span class="value">{{ reference.amount }}</span>
            </div>
            <div class="info-row">
              <span class="label">Valor:</span>
              <span class="value">{{ formatCurrency(reference.value) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Data Estimada:</span>
              <span class="value">{{ reference.estimatedDate }}</span>
            </div>
            <div class="info-row">
              <span class="label">Data de Abertura:</span>
              <span class="value">{{ reference.createdAt }}</span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="card-actions">
            <Tag
              :value="reference.status"
              :severity="getStatusSeverity(reference.status)"
            />
            <div class="actions-buttons">
              <Button
                icon="pi pi-pencil"
                severity="info"
                text
                @click="editReference(reference.id)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                @click="deleteReference(reference.id)"
              />
            </div>
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
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import { getReferencesByOrganization, deleteReference as deleteReferenceService } from '@/services/referenceService'

// Composables
const toast = useToast()

// Data
const references = ref<any[]>([])
const loading = ref(false)

// Methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatSizes = (sizeJson: string): string => {
  try {
    const sizesObj = JSON.parse(sizeJson)
    return Object.entries(sizesObj)
      .map(([name, quantity]) => `<strong>${name}</strong>: ${quantity}`)
      .join(' - ')
  } catch (e) {
    // Se não for JSON válido, retorna o valor original
    return sizeJson
  }
}

const loadReferences = async () => {
  loading.value = true

  try {
    const response = await getReferencesByOrganization()

    if (response.success) {
      references.value = response.data.map((reference: any) => {
        const totalValue = reference.amount * reference.value
        return {
          id: reference.id,
          code: reference.code,
          name: reference.name,
          color: reference.color,
          amount: reference.amount,
          value: reference.value,
          totalValue: totalValue,
          size: formatSizes(reference.size),
          status: reference.status || 'Em Andamento',
          estimatedDate: new Date(reference.estimated_date).toLocaleDateString('pt-BR'),
          createdAt: new Date(reference.created_at).toLocaleDateString('pt-BR'),
          customerName: reference.customer?.name || 'N/A',
          lotNumber: reference.lot?.number || 'N/A',
          serviceTypeName: reference.type_service?.name || 'N/A'
        }
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar referências',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar referências',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

// Emits
const emit = defineEmits(['edit'])

const getStatusSeverity = (status: string) => {
  if (status === 'Concluída') return 'success'
  if (status === 'Cancelada') return 'danger'
  return 'info'
}

const editReference = (id: number) => {
  emit('edit', id)
}

const deleteReference = async (id: number) => {
  if (!confirm('Tem certeza que deseja deletar esta referência?')) {
    return
  }

  try {
    const response = await deleteReferenceService(id)

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Referência deletada com sucesso!',
        life: 3000
      })

      // Recarrega a lista
      loadReferences()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao deletar referência',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao deletar referência',
      life: 3000
    })
  }
}

// Lifecycle
onMounted(() => {
  loadReferences()
})

// Expõe loadReferences para o componente pai
defineExpose({
  loadReferences
})
</script>

<style scoped lang="scss">
.list-reference {
  padding: 1rem;
  font-family: Avenir, Helvetica, sans-serif;
  height: 100%;
  overflow-y: auto;
}

.reference-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.reference-card {
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

  .total-value {
    font-size: 0.95rem;
    font-weight: 500;
    color: #6c757d;
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
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-top: 1px solid #dee2e6;

  .actions-buttons {
    display: flex;
    gap: 0.5rem;
  }
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
