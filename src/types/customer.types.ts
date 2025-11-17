/**
 * Tipos TypeScript para Customer
 */

export interface Customer {
  id?: number
  name: string
  organization_id: string
  date_close?: string | null
  created_at?: string
}

export interface CustomerResponse {
  success: boolean
  error?: string
  data?: Customer | Customer[]
}
