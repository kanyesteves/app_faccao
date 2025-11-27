/**
 * Tipos TypeScript para Reference
 */

export interface Reference {
  id?: number
  code: string
  name: string
  color: string
  amount: number
  value: number
  estimated_date: string
  size: string // JSON stringificado: '{"P": 10, "M": 20}'
  status: string
  service_id: number
  lot_id: number
  organization_id: string
  customer_id: number
  created_at?: string
}

export interface ReferenceResponse {
  success: boolean
  error?: string
  data?: Reference | Reference[]
}

// Interface auxiliar para trabalhar com tamanhos no formulário
export interface SizeItem {
  name: string
  quantity: number
}
