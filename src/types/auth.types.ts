/**
 * Tipos TypeScript para Autenticação
 *
 * Define as interfaces e tipos usados no sistema de autenticação
 */

import { User, Session } from '@supabase/supabase-js'

// Credenciais de login
export interface LoginCredentials {
  email: string
  password: string
}

// Estado da autenticação
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

// Resposta de autenticação
export interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}
