/**
 * Service para gerenciar Organization
 *
 * Gerencia operações de leitura e atualização da organização do usuário
 */

import { supabase } from './supabaseClient'
import type { Organization } from '@/types/organization.types'

/**
 * Busca a organização do usuário logado
 */
export const getOrganizationByUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Usuário não autenticado',
        data: null
      }
    }

    const { data, error } = await supabase
      .from('organization')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar organização:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    return {
      success: true,
      data: data as Organization
    }
  } catch (error: any) {
    console.error('Erro ao buscar organização:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao buscar organização',
      data: null
    }
  }
}

/**
 * Atualiza os dados da organização
 */
export const updateOrganization = async (
  organizationId: number,
  organization: Omit<Organization, 'id' | 'created_at' | 'user_id'>
) => {
  try {
    const { data, error } = await supabase
      .from('organization')
      .update({
        name: organization.name,
        email: organization.email,
        cnpj: organization.cnpj,
        plan: organization.plan
      })
      .eq('id', organizationId)
      .select()

    if (error) {
      console.error('Erro ao atualizar organização:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      data: data[0] as Organization
    }
  } catch (error: any) {
    console.error('Erro ao atualizar organização:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao atualizar organização'
    }
  }
}
