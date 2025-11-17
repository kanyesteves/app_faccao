<template>
  <Dialog
    v-model:visible="visible"
    header="Criar Cliente"
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
          <label for="dateClose">Data de Fechamento (opcional)</label>
          <DatePicker
            id="dateClose"
            v-model="dateClose"
            placeholder="Selecione a data de fechamento"
            dateFormat="dd/mm/yy"
            showIcon
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
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { createCustomer } from '@/services/customerService'

// Props
interface Props {
  show: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['update:show', 'customerCreated'])

// Composables
const toast = useToast()

// Data
const visible = ref(props.show)
const customerName = ref('')
const dateClose = ref<Date | null>(null)
const loading = ref(false)
const submitted = ref(false)

// Watchers
watch(() => props.show, (newValue) => {
  visible.value = newValue
  if (newValue) {
    resetForm()
  }
})

watch(visible, (newValue) => {
  emit('update:show', newValue)
})

// Methods
const resetForm = () => {
  customerName.value = ''
  dateClose.value = null
  submitted.value = false
  loading.value = false
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
    const response = await createCustomer({
      name: customerName.value.trim(),
      date_close: dateClose.value ? dateClose.value.toISOString().split('T')[0] : null
    })

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Cliente criado com sucesso!',
        life: 3000
      })

      emit('customerCreated')
      visible.value = false
      resetForm()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao criar cliente',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao criar cliente',
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
