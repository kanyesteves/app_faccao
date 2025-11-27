<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Editar Referência' : 'Criar Referência'"
    :modal="true"
    :style="{ width: '90vw', maxWidth: '700px' }"
  >
    <div class="save-reference">
      <form @submit.prevent="handleSubmit">
        <div class="form-row">
          <div class="form-field">
            <label for="referenceCode">Código</label>
            <InputText
              id="referenceCode"
              v-model="formData.code"
              placeholder="Digite o código"
              :class="{ 'p-invalid': submitted && !formData.code }"
            />
            <small v-if="submitted && !formData.code" class="p-error">
              Código é obrigatório
            </small>
          </div>

          <div class="form-field">
            <label for="referenceName">Nome</label>
            <InputText
              id="referenceName"
              v-model="formData.name"
              placeholder="Digite o nome"
              :class="{ 'p-invalid': submitted && !formData.name }"
            />
            <small v-if="submitted && !formData.name" class="p-error">
              Nome é obrigatório
            </small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="referenceColor">Cor</label>
            <InputText
              id="referenceColor"
              v-model="formData.color"
              placeholder="#FFFFFF"
              :class="{ 'p-invalid': submitted && !formData.color }"
            />
            <small v-if="submitted && !formData.color" class="p-error">
              Cor é obrigatória
            </small>
          </div>

          <div class="form-field sizes-field">
            <label>Tamanhos</label>
            <div class="sizes-container">
              <div v-for="(sizeItem, index) in sizes" :key="index" class="size-row">
                <InputText
                  v-model="sizeItem.name"
                  placeholder="ex: P, M, G"
                  :class="{ 'p-invalid': submitted && !sizeItem.name }"
                  class="size-name-input"
                />
                <InputText
                  v-model.number="sizeItem.quantity"
                  placeholder="Quantidade"
                  type="number"
                  min="1"
                  :class="{ 'p-invalid': submitted && !sizeItem.quantity }"
                  class="size-quantity-input"
                  @input="updateTotalAmount"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="removeSize(index)"
                  type="button"
                  :disabled="sizes.length === 1"
                />
              </div>
            </div>
            <Button
              label="Adicionar Tamanho"
              icon="pi pi-plus"
              severity="secondary"
              @click="addSize"
              type="button"
              class="add-size-btn"
            />
            <small v-if="submitted && sizes.some(s => !s.name || !s.quantity)" class="p-error">
              Todos os tamanhos devem ter nome e quantidade preenchidos
            </small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="referenceAmount">Quantidade</label>
            <InputText
              id="referenceAmount"
              v-model.number="formData.amount"
              placeholder="Digite a quantidade"
              type="number"
              min="1"
              :class="{ 'p-invalid': submitted && !formData.amount }"
            />
            <small v-if="submitted && !formData.amount" class="p-error">
              Quantidade é obrigatória
            </small>
          </div>

          <div class="form-field">
            <label for="referenceValue">Valor (R$)</label>
            <InputText
              id="referenceValue"
              v-model.number="formData.value"
              placeholder="Digite o valor"
              type="number"
              step="0.01"
              min="0"
              :class="{ 'p-invalid': submitted && !formData.value }"
            />
            <small v-if="submitted && !formData.value" class="p-error">
              Valor é obrigatório
            </small>
          </div>
        </div>

        <div class="form-field">
          <label for="estimatedDate">Data Estimada</label>
          <DatePicker
            id="estimatedDate"
            v-model="formData.estimated_date"
            placeholder="Selecione a data estimada"
            dateFormat="dd/mm/yy"
            showIcon
            :class="{ 'p-invalid': submitted && !formData.estimated_date }"
          />
          <small v-if="submitted && !formData.estimated_date" class="p-error">
            Data estimada é obrigatória
          </small>
        </div>

        <div class="form-field">
          <label for="customer">Cliente</label>
          <Select
            id="customer"
            v-model="formData.customer_id"
            :options="customers"
            optionLabel="name"
            optionValue="id"
            placeholder="Selecione o cliente"
            emptyMessage="Nenhum cliente cadastrado. Cadastre um cliente primeiro."
            :class="{ 'p-invalid': submitted && !formData.customer_id }"
            :loading="loadingCustomers"
          />
          <small v-if="submitted && !formData.customer_id" class="p-error">
            Cliente é obrigatório
          </small>
        </div>

        <div class="form-field">
          <label for="lot">Lote</label>
          <Select
            id="lot"
            v-model="formData.lot_id"
            :options="lots"
            optionLabel="number"
            optionValue="id"
            placeholder="Selecione o lote"
            emptyMessage="Nenhum lote cadastrado. Cadastre um lote primeiro."
            :class="{ 'p-invalid': submitted && !formData.lot_id }"
            :loading="loadingLots"
          />
          <small v-if="submitted && !formData.lot_id" class="p-error">
            Lote é obrigatório
          </small>
        </div>

        <div class="form-field">
          <label for="serviceType">Tipo de Serviço</label>
          <Select
            id="serviceType"
            v-model="formData.service_id"
            :options="serviceTypes"
            optionLabel="name"
            optionValue="id"
            placeholder="Selecione o tipo de serviço"
            emptyMessage="Nenhum tipo de serviço cadastrado. Cadastre um tipo de serviço primeiro."
            :class="{ 'p-invalid': submitted && !formData.service_id }"
            :loading="loadingServiceTypes"
          />
          <small v-if="submitted && !formData.service_id" class="p-error">
            Tipo de serviço é obrigatório
          </small>
        </div>

        <div class="form-field">
          <label for="status">Status</label>
          <Select
            id="status"
            v-model="formData.status"
            :options="statusOptions"
            placeholder="Selecione o status"
            :class="{ 'p-invalid': submitted && !formData.status }"
          />
          <small v-if="submitted && !formData.status" class="p-error">
            Status é obrigatório
          </small>
        </div>

        <div class="form-actions">
          <Button
            label="Cancelar"
            severity="secondary"
            @click="handleCancel"
            type="button"
          />
          <Button
            label="Salvar"
            type="submit"
            :loading="loading"
          />
        </div>
      </form>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { createReference, updateReference, getReferenceById } from '@/services/referenceService'
import { getCustomersByOrganization } from '@/services/customerService'
import { getLotsByOrganization } from '@/services/lotService'
import { getTypeServicesByOrganization } from '@/services/typeServiceService'
import type { SizeItem } from '@/types/reference.types'

// Props
interface Props {
  show: boolean
  referenceId?: number | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['update:show', 'referenceCreated'])

// Composables
const toast = useToast()

// Data
const visible = ref(props.show)
const loading = ref(false)
const submitted = ref(false)
const loadingCustomers = ref(false)
const loadingLots = ref(false)
const loadingServiceTypes = ref(false)
const isEditing = ref(false)

const formData = ref({
  code: '',
  name: '',
  color: '',
  amount: null as number | null,
  value: null as number | null,
  estimated_date: null as Date | null,
  size: '',
  status: 'Em Andamento',
  service_id: null as number | null,
  lot_id: null as number | null,
  customer_id: null as number | null
})

const sizes = ref<SizeItem[]>([{ name: '', quantity: 0 }])

const customers = ref<any[]>([])
const lots = ref<any[]>([])
const serviceTypes = ref<any[]>([])
const statusOptions = ref<string[]>(['Em Andamento', 'Concluída', 'Cancelada'])

// Watchers
watch(() => props.show, async (newValue) => {
  visible.value = newValue
  if (newValue) {
    await loadSelectOptions()
    if (props.referenceId) {
      isEditing.value = true
      await loadReference(props.referenceId)
    } else {
      isEditing.value = false
      resetForm()
    }
  }
})

watch(visible, (newValue) => {
  emit('update:show', newValue)
})

// Methods
const loadSelectOptions = async () => {
  // Carrega clientes
  loadingCustomers.value = true
  try {
    const customerResponse = await getCustomersByOrganization()
    if (customerResponse.success) {
      customers.value = customerResponse.data
    }
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
  } finally {
    loadingCustomers.value = false
  }

  // Carrega lotes
  loadingLots.value = true
  try {
    const lotResponse = await getLotsByOrganization()
    if (lotResponse.success) {
      lots.value = lotResponse.data
    }
  } catch (error) {
    console.error('Erro ao carregar lotes:', error)
  } finally {
    loadingLots.value = false
  }

  // Carrega tipos de serviço
  loadingServiceTypes.value = true
  try {
    const serviceResponse = await getTypeServicesByOrganization()
    if (serviceResponse.success) {
      serviceTypes.value = serviceResponse.data
    }
  } catch (error) {
    console.error('Erro ao carregar tipos de serviço:', error)
  } finally {
    loadingServiceTypes.value = false
  }
}

const resetForm = () => {
  formData.value = {
    code: '',
    name: '',
    color: '',
    amount: null,
    value: null,
    estimated_date: null,
    size: '',
    status: 'Em Andamento',
    service_id: null,
    lot_id: null,
    customer_id: null
  }
  sizes.value = [{ name: '', quantity: 0 }]
  submitted.value = false
  loading.value = false
  isEditing.value = false
}

const addSize = () => {
  sizes.value.push({ name: '', quantity: 0 })
}

const removeSize = (index: number) => {
  if (sizes.value.length > 1) {
    sizes.value.splice(index, 1)
    updateTotalAmount()
  }
}

const updateTotalAmount = () => {
  const total = sizes.value.reduce((sum, sizeItem) => {
    return sum + (sizeItem.quantity || 0)
  }, 0)
  formData.value.amount = total > 0 ? total : null
}

const loadReference = async (id: number) => {
  loading.value = true
  try {
    const response = await getReferenceById(id)

    if (response.success && response.data) {
      formData.value = {
        code: response.data.code,
        name: response.data.name,
        color: response.data.color,
        amount: response.data.amount,
        value: response.data.value,
        estimated_date: new Date(response.data.estimated_date),
        size: response.data.size,
        status: response.data.status || 'Em Andamento',
        service_id: response.data.service_id,
        lot_id: response.data.lot_id,
        customer_id: response.data.customer_id
      }

      // Converter JSON string para array de tamanhos
      try {
        const sizesObj = JSON.parse(response.data.size)
        sizes.value = Object.entries(sizesObj).map(([name, quantity]) => ({
          name,
          quantity: quantity as number
        }))
      } catch (e) {
        // Se não for JSON válido, inicializa com valor vazio
        sizes.value = [{ name: '', quantity: 0 }]
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar referência',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar referência',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  visible.value = false
  resetForm()
}

const handleSubmit = async () => {
  submitted.value = true

  // Validação
  const hasSizesError = sizes.value.some(s => !s.name.trim() || !s.quantity || s.quantity <= 0)

  if (
    !formData.value.code.trim() ||
    !formData.value.name.trim() ||
    !formData.value.color.trim() ||
    hasSizesError ||
    !formData.value.status.trim() ||
    !formData.value.amount ||
    !formData.value.value ||
    !formData.value.estimated_date ||
    !formData.value.customer_id ||
    !formData.value.lot_id ||
    !formData.value.service_id
  ) {
    return
  }

  loading.value = true

  try {
    // Converter array de tamanhos para objeto JSON
    const sizesObj: Record<string, number> = {}
    sizes.value.forEach(sizeItem => {
      if (sizeItem.name.trim()) {
        sizesObj[sizeItem.name.trim()] = sizeItem.quantity
      }
    })

    const referenceData = {
      code: formData.value.code.trim(),
      name: formData.value.name.trim(),
      color: formData.value.color.trim(),
      amount: formData.value.amount,
      value: formData.value.value,
      estimated_date: formData.value.estimated_date.toISOString().split('T')[0],
      size: JSON.stringify(sizesObj), // Converter para JSON string
      status: formData.value.status.trim(),
      service_id: formData.value.service_id,
      lot_id: formData.value.lot_id,
      customer_id: formData.value.customer_id
    }

    const response = isEditing.value && props.referenceId
      ? await updateReference(props.referenceId, referenceData)
      : await createReference(referenceData)

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: isEditing.value ? 'Referência atualizada com sucesso!' : 'Referência criada com sucesso!',
        life: 3000
      })

      emit('referenceCreated')
      visible.value = false
      resetForm()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || `Erro ao ${isEditing.value ? 'atualizar' : 'criar'} referência`,
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || `Erro inesperado ao ${isEditing.value ? 'atualizar' : 'criar'} referência`,
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.save-reference {
  padding: 1rem;
  font-family: Avenir, Helvetica, sans-serif;

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    // Mobile: 1 coluna
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: #2c3e50;
      font-family: Avenir, Helvetica, sans-serif;
    }

    .p-error {
      color: #e24c4c;
      font-size: 0.875rem;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    // Mobile: botões em coluna
    @media (max-width: 768px) {
      flex-direction: column-reverse;

      button {
        width: 100%;
      }
    }
  }

  .sizes-field {
    .sizes-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .size-row {
      display: grid;
      grid-template-columns: 2fr 1.5fr auto;
      gap: 0.5rem;
      align-items: center;

      @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr auto;
      }
    }

    .size-name-input,
    .size-quantity-input {
      width: 100%;
    }

    .add-size-btn {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
}
</style>
