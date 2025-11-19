<template>
  <Dialog
    v-model:visible="visible"
    :header="isEditing ? 'Editar Lote' : 'Criar Lote'"
    :modal="true"
    :style="{ width: '90vw', maxWidth: '600px' }"
  >
    <div class="save-lot">
      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="lotNumber">Número do Lote</label>
          <InputText
            id="lotNumber"
            v-model="lotNumber"
            placeholder="Digite o número do lote"
            :class="{ 'p-invalid': submitted && !lotNumber }"
            autofocus
          />
          <small v-if="submitted && !lotNumber" class="p-error">
            Número do lote é obrigatório
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
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { createLot, updateLot, getLotById } from '@/services/lotService'

// Props
interface Props {
  show: boolean
  lotId?: string | null
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['update:show', 'lotCreated'])

// Composables
const toast = useToast()

// Data
const visible = ref(props.show)
const lotNumber = ref('')
const loading = ref(false)
const submitted = ref(false)
const isEditing = ref(false)

// Watchers
watch(() => props.show, async (newValue) => {
  visible.value = newValue
  if (newValue) {
    if (props.lotId) {
      isEditing.value = true
      await loadLot(props.lotId)
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
  lotNumber.value = ''
  submitted.value = false
  loading.value = false
  isEditing.value = false
}

const loadLot = async (id: string) => {
  loading.value = true
  try {
    const response = await getLotById(id)

    if (response.success && response.data) {
      lotNumber.value = response.data.number
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar lote',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar lote',
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

  if (!lotNumber.value.trim()) {
    return
  }

  loading.value = true

  try {
    const response = isEditing.value && props.lotId
      ? await updateLot(props.lotId, lotNumber.value.trim())
      : await createLot(lotNumber.value.trim())

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: isEditing.value ? 'Lote atualizado com sucesso!' : 'Lote criado com sucesso!',
        life: 3000
      })

      emit('lotCreated')
      visible.value = false
      resetForm()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || `Erro ao ${isEditing.value ? 'atualizar' : 'criar'} lote`,
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || `Erro inesperado ao ${isEditing.value ? 'atualizar' : 'criar'} lote`,
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.save-lot {
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
