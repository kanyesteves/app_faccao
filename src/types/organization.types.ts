/**
 * Tipos TypeScript para Organization
 */

export interface Organization {
  id?: number
  name: string
  email: string
  cnpj: string
  plan: string
  user_id: string
  created_at?: string
}

export interface OrganizationResponse {
  success: boolean
  error?: string
  data?: Organization
}
