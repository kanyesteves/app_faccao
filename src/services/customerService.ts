/**
 * Service para gerenciar Clientes
 *
 * Gerencia operações CRUD de clientes no Supabase
 */

import { supabase } from './supabaseClient'
import type { Customer } from '@/types/customer.types'

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
 * Cria um novo cliente
 */
export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'organization_id'>) => {
  try {
    const organizationId = await getUserOrganizationId()

    if (!organizationId) {
      return {
        success: false,
        error: 'Organização não encontrada para o usuário'
      }
    }

    const { data, error } = await supabase
      .from('customer')
      .insert([
        {
          name: customer.name,
          date_close: customer.date_close || null,
          organization_id: organizationId
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao criar cliente:', error)
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
    console.error('Erro ao criar cliente:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao criar cliente'
    }
  }
}

/**
 * Lista todos os clientes da organização do usuário
 */
export const getCustomersByOrganization = async () => {
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
      .from('customer')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar clientes:', error)
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
    console.error('Erro ao buscar clientes:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao buscar clientes',
      data: []
    }
  }
}

/**
 * Atualiza um cliente
 */
export const updateCustomer = async (customerId: number, customer: Omit<Customer, 'id' | 'created_at' | 'organization_id'>) => {
  try {
    const { data, error } = await supabase
      .from('customer')
      .update({
        name: customer.name,
        date_close: customer.date_close || null
      })
      .eq('id', customerId)
      .select()

    if (error) {
      console.error('Erro ao atualizar cliente:', error)
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
    console.error('Erro ao atualizar cliente:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao atualizar cliente'
    }
  }
}

/**
 * Deleta um cliente
 */
export const deleteCustomer = async (customerId: number) => {
  try {
    const { error } = await supabase
      .from('customer')
      .delete()
      .eq('id', customerId)

    if (error) {
      console.error('Erro ao deletar cliente:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Erro ao deletar cliente:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao deletar cliente'
    }
  }
}
