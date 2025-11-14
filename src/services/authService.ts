/**
 * Serviço de Autenticação
 *
 * Contém todas as funções relacionadas à autenticação usando Supabase.
 * Funções incluídas:
 * - signIn: Fazer login
 * - signOut: Fazer logout
 * - getCurrentUser: Pegar usuário atual
 * - getSession: Pegar sessão atual
 */

import { supabase } from './supabaseClient'
import { LoginCredentials, AuthResponse } from '@/types/auth.types'

/**
 * Faz login do usuário
 * @param credentials - Email e senha do usuário
 * @returns Objeto com sucesso/erro e dados do usuário
 */
export const signIn = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) {
      console.error('Erro do Supabase:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      user: data.user
    }
  } catch (error: any) {
    console.error('Erro inesperado:', error)
    return {
      success: false,
      error: error.message || 'Erro ao fazer login'
    }
  }
}

/**
 * Faz logout do usuário
 * @returns Objeto com sucesso/erro
 */
export const signOut = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erro ao fazer logout'
    }
  }
}

/**
 * Pega o usuário atualmente autenticado
 * @returns Usuário atual ou null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Erro ao pegar usuário atual:', error)
    return null
  }
}

/**
 * Pega a sessão atual
 * @returns Sessão atual ou null
 */
export const getSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Erro ao pegar sessão:', error)
    return null
  }
}

/**
 * Escuta mudanças no estado de autenticação
 * @param callback - Função a ser chamada quando houver mudança
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}
