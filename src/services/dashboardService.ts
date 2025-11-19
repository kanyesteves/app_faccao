/**
 * Service para gerenciar métricas do Dashboard
 */

import { getReferencesByOrganization } from './referenceService'

export interface DashboardMetrics {
  referencesInProgress: number
  valueInProduction: number
  referencesOverdue: number
  referencesCompletedThisMonth: number
  referencesByStatus: {
    labels: string[]
    data: number[]
  }
  revenueByCustomer: {
    labels: string[]
    data: number[]
  }
  productionByServiceType: {
    labels: string[]
    data: number[]
  }
}

/**
 * Busca todas as métricas do dashboard
 */
export const getDashboardMetrics = async () => {
  try {
    const response = await getReferencesByOrganization()

    if (!response.success) {
      return {
        success: false,
        error: response.error,
        data: null
      }
    }

    const references = response.data || []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 1. Referências em Andamento
    const inProgress = references.filter((ref: any) => ref.status === 'Em Andamento')
    const referencesInProgress = inProgress.length

    // 2. Valor em Produção (Em Andamento + Concluídas no período de fechamento atual)
    const valueInProduction = (references as any[]).reduce((sum: number, ref: any) => {
      // Apenas processa referências que têm cliente com dados de fechamento
      if (!ref.customer || !ref.customer.start_closing_date || !ref.customer.date_close) {
        return sum
      }

      const startClosingDay = parseInt(ref.customer.start_closing_date)
      const endClosingDay = parseInt(ref.customer.date_close)

      // Valida se os dias são números válidos
      if (isNaN(startClosingDay) || isNaN(endClosingDay)) {
        return sum
      }

      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()

      // Data de início do período: dia definido pelo usuário no MÊS ATUAL
      const periodStart = new Date(currentYear, currentMonth, startClosingDay)
      periodStart.setHours(0, 0, 0, 0)

      // Data de fim do período: dia de fechamento no PRÓXIMO MÊS
      const periodEnd = new Date(currentYear, currentMonth + 1, endClosingDay)
      periodEnd.setHours(23, 59, 59, 999)

      // Verifica se a referência foi criada dentro do período de fechamento
      const refCreatedDate = new Date(ref.created_at)
      refCreatedDate.setHours(0, 0, 0, 0)

      const isInPeriod = refCreatedDate >= periodStart && refCreatedDate <= periodEnd

      // Inclui no cálculo se estiver no período E (Em Andamento OU Concluída)
      if (isInPeriod && (ref.status === 'Em Andamento' || ref.status === 'Concluída')) {
        return sum + (ref.amount * ref.value)
      }

      return sum
    }, 0)

    // 3. Referências Atrasadas
    const referencesOverdue = inProgress.filter((ref: any) => {
      const estimatedDate = new Date(ref.estimated_date)
      estimatedDate.setHours(0, 0, 0, 0)
      return estimatedDate < today
    }).length

    // 4. Referências Concluídas no mês atual
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const referencesCompletedThisMonth = references.filter((ref: any) => {
      if (ref.status !== 'Concluída') return false
      const createdDate = new Date(ref.created_at)
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
    }).length

    // 5. Referências por Status (Gráfico Pizza)
    const statusCount: any = {}
    references.forEach((ref: any) => {
      const status = ref.status || 'Em Andamento'
      statusCount[status] = (statusCount[status] || 0) + 1
    })
    const referencesByStatus = {
      labels: Object.keys(statusCount),
      data: Object.values(statusCount)
    }

    // 6. Faturamento por Cliente (Top 5)
    const customerRevenue: any = {}
    inProgress.forEach((ref: any) => {
      const customerName = ref.customer?.name || 'Sem Cliente'
      const value = ref.amount * ref.value
      customerRevenue[customerName] = (customerRevenue[customerName] || 0) + value
    })
    const sortedCustomers = Object.entries(customerRevenue)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5)
    const revenueByCustomer = {
      labels: sortedCustomers.map(([name]) => name),
      data: sortedCustomers.map(([, value]) => value)
    }

    // 7. Produção por Tipo de Serviço
    const serviceTypeProduction: any = {}
    inProgress.forEach((ref: any) => {
      const serviceName = ref.type_service?.name || 'Sem Tipo'
      const amount = ref.amount
      serviceTypeProduction[serviceName] = (serviceTypeProduction[serviceName] || 0) + amount
    })
    const productionByServiceType = {
      labels: Object.keys(serviceTypeProduction),
      data: Object.values(serviceTypeProduction)
    }

    return {
      success: true,
      data: {
        referencesInProgress,
        valueInProduction,
        referencesOverdue,
        referencesCompletedThisMonth,
        referencesByStatus,
        revenueByCustomer,
        productionByServiceType
      } as DashboardMetrics
    }
  } catch (error: any) {
    console.error('Erro ao buscar métricas do dashboard:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao buscar métricas',
      data: null
    }
  }
}
