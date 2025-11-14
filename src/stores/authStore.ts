/**
 * Store de Autenticação (Pinia)
 *
 * Gerencia o estado global de autenticação da aplicação.
 * Inclui:
 * - State: user, session, loading, error
 * - Actions: login, logout, checkAuth, initialize
 * - Getters: isAuthenticated, userEmail, userName
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, Session } from '@supabase/supabase-js'
import * as authService from '@/services/authService'
import type { LoginCredentials } from '@/types/auth.types'

export const useAuthStore = defineStore('auth', () => {
  // ========== STATE ==========
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== GETTERS ==========
  const isAuthenticated = computed(() => !!user.value && !!session.value)
  const userEmail = computed(() => user.value?.email || '')
  const userName = computed(() => user.value?.user_metadata?.name || user.value?.email || '')

  // ========== ACTIONS ==========

  /**
   * Faz login do usuário
   */
  const login = async (credentials: LoginCredentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.signIn(credentials)

      if (response.success && response.user) {
        user.value = response.user
        session.value = await authService.getSession()
        return { success: true }
      } else {
        error.value = response.error || 'Erro ao fazer login'
        return { success: false, error: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Erro inesperado ao fazer login'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await authService.signOut()

      if (response.success) {
        user.value = null
        session.value = null
        return { success: true }
      } else {
        error.value = response.error || 'Erro ao fazer logout'
        return { success: false, error: error.value }
      }
    } catch (err: any) {
      error.value = err.message || 'Erro inesperado ao fazer logout'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  const checkAuth = async () => {
    loading.value = true

    try {
      const currentUser = await authService.getCurrentUser()
      const currentSession = await authService.getSession()

      if (currentUser && currentSession) {
        user.value = currentUser
        session.value = currentSession
        return true
      } else {
        user.value = null
        session.value = null
        return false
      }
    } catch (err) {
      console.error('Erro ao verificar autenticação:', err)
      user.value = null
      session.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Inicializa a store e escuta mudanças de autenticação
   */
  const initialize = () => {
    // Verifica autenticação inicial
    checkAuth()

    // Escuta mudanças no estado de autenticação
    authService.onAuthStateChange((event, newSession) => {

      if (event === 'SIGNED_IN' && newSession) {
        session.value = newSession
        user.value = newSession.user
      } else if (event === 'SIGNED_OUT') {
        user.value = null
        session.value = null
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        session.value = newSession
        user.value = newSession.user
      }
    })
  }

  /**
   * Limpa erros
   */
  const clearError = () => {
    error.value = null
  }

  // Retorna tudo que a store expõe
  return {
    // State
    user,
    session,
    loading,
    error,
    // Getters
    isAuthenticated,
    userEmail,
    userName,
    // Actions
    login,
    logout,
    checkAuth,
    initialize,
    clearError
  }
})
