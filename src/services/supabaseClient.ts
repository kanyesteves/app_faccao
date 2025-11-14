/**
 * Cliente Supabase
 *
 * Este arquivo configura e exporta o cliente do Supabase
 * que será usado em toda a aplicação para autenticação e banco de dados.
 */

import { createClient } from '@supabase/supabase-js'

// Pega as variáveis de ambiente
const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

// Validação: garante que as variáveis foram definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Credenciais do Supabase não encontradas! Verifique o arquivo .env')
}

// Cria e exporta o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persiste a sessão no localStorage
    persistSession: true,
    // Detecta automaticamente mudanças de sessão
    autoRefreshToken: true,
    // Storage onde a sessão será salva
    storage: window.localStorage
  }
})
