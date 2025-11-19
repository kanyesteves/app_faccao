<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Editar Cliente' : 'Criar Cliente'"
    :modal="true"
    :style="{ width: '90vw', maxWidth: '600px' }"
  >
    <div class="save-customer">
      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="customerName">Nome do Cliente</label>
          <InputText
            id="customerName"
            v-model="customerName"
            placeholder="Digite o nome do cliente"
            :class="{ 'p-invalid': submitted && !customerName }"
            autofocus
          />
          <small v-if="submitted && !customerName" class="p-error">
            Nome do cliente é obrigatório
          </small>
        </div>

        <div class="form-field">
          <label for="dayClose">Dia do Fechamento (opcional)</label>
          <InputText
            id="dayClose"
            v-model="dayClose"
            placeholder="Digite o dia (1-31)"
            type="number"
            min="1"
            max="31"
          />
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
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { createCustomer, updateCustomer, getCustomerById } from '@/services/customerService'

// Props
interface Props {
  show: boolean
  customerId?: number | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['update:show', 'customerCreated'])

// Composables
const toast = useToast()

// Data
const visible = ref(props.show)
const customerName = ref('')
const dayClose = ref('')
const loading = ref(false)
const submitted = ref(false)
const isEditing = ref(false)

// Watchers
watch(() => props.show, async (newValue) => {
  visible.value = newValue
  if (newValue) {
    if (props.customerId) {
      isEditing.value = true
      await loadCustomer(props.customerId)
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
const resetForm = () => {
  customerName.value = ''
  dayClose.value = ''
  submitted.value = false
  loading.value = false
  isEditing.value = false
}

const loadCustomer = async (id: number) => {
  loading.value = true
  try {
    const response = await getCustomerById(id)

    if (response.success && response.data) {
      customerName.value = response.data.name
      dayClose.value = response.data.date_close || ''
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar cliente',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar cliente',
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

  if (!customerName.value.trim()) {
    return
  }

  loading.value = true

  try {
    const customerData = {
      name: customerName.value.trim(),
      date_close: dayClose.value.trim() || null
    }

    const response = isEditing.value && props.customerId
      ? await updateCustomer(props.customerId, customerData)
      : await createCustomer(customerData)

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: isEditing.value ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!',
        life: 3000
      })

      emit('customerCreated')
      visible.value = false
      resetForm()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || `Erro ao ${isEditing.value ? 'atualizar' : 'criar'} cliente`,
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || `Erro inesperado ao ${isEditing.value ? 'atualizar' : 'criar'} cliente`,
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.save-customer {
  padding: 1rem;
  font-family: Avenir, Helvetica, sans-serif;

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
  }
}
</style>
