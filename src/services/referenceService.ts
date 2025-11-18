/**
 * Service para gerenciar Referências
 *
 * Gerencia operações CRUD de referências no Supabase
 */

import { supabase } from './supabaseClient'
import type { Reference } from '@/types/reference.types'
import { getUserOrganizationId } from './customerService'

/**
 * Cria uma nova referência
 */
export const createReference = async (reference: Omit<Reference, 'id' | 'created_at' | 'organization_id'>) => {
  try {
    const organizationId = await getUserOrganizationId()

    if (!organizationId) {
      return {
        success: false,
        error: 'Organização não encontrada para o usuário'
      }
    }

    const { data, error } = await supabase
      .from('reference')
      .insert([
        {
          code: reference.code,
          name: reference.name,
          color: reference.color,
          amount: reference.amount,
          value: reference.value,
          estimated_date: reference.estimated_date,
          size: reference.size,
          service_id: reference.service_id,
          lot_id: reference.lot_id,
          customer_id: reference.customer_id,
          organization_id: organizationId
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao criar referência:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data[0]
    }
  } catch (error: any) {
    console.error('Erro ao criar referência:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao criar referência'
    }
  }
}

/**
 * Lista todas as referências da organização do usuário
 */
export const getReferencesByOrganization = async () => {
  try {
    const organizationId = await getUserOrganizationId()

    if (!organizationId) {
      return {
        success: false,
        error: 'Organização não encontrada para o usuário',
        data: []
      }
    }

    const { data, error } = await supabase
      .from('reference')
      .select(`
        *,
        type_service:service_id (id, name),
        lot:lot_id (id, number),
        customer:customer_id (id, name)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar referências:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error: any) {
    console.error('Erro ao buscar referências:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao buscar referências',
      data: []
    }
  }
}

/**
 * Atualiza uma referência
 */
export const updateReference = async (
  referenceId: number,
  reference: Omit<Reference, 'id' | 'created_at' | 'organization_id'>
) => {
  try {
    const { data, error } = await supabase
      .from('reference')
      .update({
        code: reference.code,
        name: reference.name,
        color: reference.color,
        amount: reference.amount,
        value: reference.value,
        estimated_date: reference.estimated_date,
        size: reference.size,
        service_id: reference.service_id,
        lot_id: reference.lot_id,
        customer_id: reference.customer_id
      })
      .eq('id', referenceId)
      .select()

    if (error) {
      console.error('Erro ao atualizar referência:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data[0]
    }
  } catch (error: any) {
    console.error('Erro ao atualizar referência:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao atualizar referência'
    }
  }
}

/**
 * Deleta uma referência
 */
export const deleteReference = async (referenceId: number) => {
  try {
    const { error } = await supabase
      .from('reference')
      .delete()
      .eq('id', referenceId)

    if (error) {
      console.error('Erro ao deletar referência:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Erro ao deletar referência:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao deletar referência'
    }
  }
}
