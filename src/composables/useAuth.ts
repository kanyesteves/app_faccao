/**
 * Composable useAuth
 *
 * Facilita o uso da store de autenticação nos componentes.
 * Retorna todas as funcionalidades de autenticação de forma simplificada.
 */

import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'

export const useAuth = () => {
  const authStore = useAuthStore()

  // Pega os refs reativos da store
  const { user, session, loading, error, isAuthenticated, userEmail, userName } = storeToRefs(authStore)

  // Pega as actions
  const { login, logout, checkAuth, clearError } = authStore

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
    clearError
  }
}
