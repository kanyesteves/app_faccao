/**
 * Service para gerenciar Tipos de Serviço
 *
 * Gerencia operações CRUD de tipos de serviço no Supabase
 */

import { supabase } from './supabaseClient'

export interface TypeService {
  id?: number
  name: string
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
 * Cria um novo tipo de serviço
 */
export const createTypeService = async (name: string) => {
  try {
    const organizationId = await getUserOrganizationId()

    if (!organizationId) {
      return {
        success: false,
        error: 'Organização não encontrada para o usuário'
      }
    }

    const { data, error } = await supabase
      .from('type_service')
      .insert([
        {
          name: name,
          organization_id: organizationId
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao criar tipo de serviço:', error)
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
    console.error('Erro ao criar tipo de serviço:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao criar tipo de serviço'
    }
  }
}

/**
 * Lista todos os tipos de serviço da organização do usuário
 */
export const getTypeServicesByOrganization = async () => {
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
      .from('type_service')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar tipos de serviço:', error)
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
    console.error('Erro ao buscar tipos de serviço:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao buscar tipos de serviço',
      data: []
    }
  }
}

/**
 * Atualiza um tipo de serviço
 */
export const updateTypeService = async (typeServiceId: number, name: string) => {
  try {
    const { data, error } = await supabase
      .from('type_service')
      .update({ name: name })
      .eq('id', typeServiceId)
      .select()

    if (error) {
      console.error('Erro ao atualizar tipo de serviço:', error)
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
    console.error('Erro ao atualizar tipo de serviço:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao atualizar tipo de serviço'
    }
  }
}

/**
 * Deleta um tipo de serviço
 */
export const deleteTypeService = async (typeServiceId: number) => {
  try {
    const { error } = await supabase
      .from('type_service')
      .delete()
      .eq('id', typeServiceId)

    if (error) {
      console.error('Erro ao deletar tipo de serviço:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Erro ao deletar tipo de serviço:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao deletar tipo de serviço'
    }
  }
}
