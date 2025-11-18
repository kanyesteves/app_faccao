<template>
  <Dialog
    v-model:visible="visible"
    header="Criar Tipo de Serviço"
    :modal="true"
    :style="{ width: '90vw', maxWidth: '600px' }"
  >
    <div class="save-type-service">
      <form @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="typeName">Nome do Tipo de Serviço</label>
          <InputText
            id="typeName"
            v-model="typeName"
            placeholder="Digite o nome do tipo de serviço"
            :class="{ 'p-invalid': submitted && !typeName }"
            autofocus
          />
          <small v-if="submitted && !typeName" class="p-error">
            Nome do tipo de serviço é obrigatório
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
import { createTypeService } from '@/services/typeServiceService'

// Props
interface Props {
  show: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['update:show', 'typeServiceCreated'])

// Composables
const toast = useToast()

// Data
const visible = ref(props.show)
const typeName = ref('')
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
  typeName.value = ''
  submitted.value = false
  loading.value = false
}

const handleCancel = () => {
  visible.value = false
  resetForm()
}

const handleSubmit = async () => {
  submitted.value = true

  if (!typeName.value.trim()) {
    return
  }

  loading.value = true

  try {
    const response = await createTypeService(typeName.value.trim())

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Tipo de serviço criado com sucesso!',
        life: 3000
      })

      emit('typeServiceCreated')
      visible.value = false
      resetForm()
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao criar tipo de serviço',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao criar tipo de serviço',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.save-type-service {
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
