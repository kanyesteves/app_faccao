/**
 * Service para gerenciar Lotes
 *
 * Gerencia operações CRUD de lotes no Supabase
 */

import { supabase } from './supabaseClient'

export interface Lot {
  id?: string
  number: string
  created_at?: string
  organization_id: string
}

/**
 * Busca o organization_id do usuário logado
 */
export const getUserOrganizationId = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    // Busca a organização onde user_id = user.id
    const { data, error } = await supabase
      .from('organization')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar organization:', error)
      return null
    }

    if (!data) {
      return null
    }

    return data?.id || null
  } catch (error) {
    console.error('Erro ao obter organization_id:', error)
    return null
  }
}

/**
 * Cria um novo lote
 */
export const createLot = async (lotNumber: string) => {
  try {
    const organizationId = await getUserOrganizationId()

    if (!organizationId) {
      return {
        success: false,
        error: 'Organização não encontrada para o usuário'
      }
    }

    const { data, error } = await supabase
      .from('lot')
      .insert([
        {
          number: lotNumber,
          organization_id: organizationId
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao criar lote:', error)
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
    console.error('Erro ao criar lote:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao criar lote'
    }
  }
}

/**
 * Lista todos os lotes da organização do usuário
 */
export const getLotsByOrganization = async () => {
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
      .from('lot')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar lotes:', error)
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
    console.error('Erro ao buscar lotes:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao buscar lotes',
      data: []
    }
  }
}

/**
 * Atualiza um lote
 */
export const updateLot = async (lotId: string, lotNumber: string) => {
  try {
    const { data, error } = await supabase
      .from('lot')
      .update({ number: lotNumber })
      .eq('id', lotId)
      .select()

    if (error) {
      console.error('Erro ao atualizar lote:', error)
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
    console.error('Erro ao atualizar lote:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao atualizar lote'
    }
  }
}

/**
 * Deleta um lote
 */
export const deleteLot = async (lotId: string) => {
  try {
    const { error } = await supabase
      .from('lot')
      .delete()
      .eq('id', lotId)

    if (error) {
      console.error('Erro ao deletar lote:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Erro ao deletar lote:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao deletar lote'
    }
  }
}
