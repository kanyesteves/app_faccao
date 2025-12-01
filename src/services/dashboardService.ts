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
 * Filtra referências pelo período de fechamento do cliente
 * Retorna apenas referências que:
 * - Têm cliente com dados de fechamento válidos
 * - Foram criadas dentro do período de fechamento atual
 * - Estão "Em Andamento" ou "Concluída"
 */
const filterByClosingPeriod = (references: any[], today: Date): any[] => {
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  return references.filter((ref: any) => {
    // Sem cliente ou sem dados de fechamento = não inclui
    if (!ref.customer?.start_closing_date || !ref.customer?.date_close) {
      return false
    }

    const startClosingDay = parseInt(ref.customer.start_closing_date)
    const endClosingDay = parseInt(ref.customer.date_close)

    // Valida se os dias são números válidos
    if (isNaN(startClosingDay) || isNaN(endClosingDay)) {
      return false
    }

    // Determina o período de fechamento baseado na data atual
    let periodStart: Date
    let periodEnd: Date

    // Se hoje está ANTES do dia de início do fechamento
    // O período atual é do mês ANTERIOR até o mês ATUAL
    // Exemplo: Fechamento 10-10, hoje é 05/12 -> período é 10/11 a 10/12
    if (currentDay < startClosingDay) {
      periodStart = new Date(currentYear, currentMonth - 1, startClosingDay)
      periodEnd = new Date(currentYear, currentMonth, endClosingDay)
    }
    // Se hoje está APÓS ou IGUAL ao dia de início do fechamento
    // O período atual é do mês ATUAL até o PRÓXIMO mês
    // Exemplo: Fechamento 10-10, hoje é 15/12 -> período é 10/12 a 10/01
    else {
      periodStart = new Date(currentYear, currentMonth, startClosingDay)
      periodEnd = new Date(currentYear, currentMonth + 1, endClosingDay)
    }

    periodStart.setHours(0, 0, 0, 0)
    periodEnd.setHours(23, 59, 59, 999)

    // Verifica se a referência foi criada dentro do período de fechamento
    const refCreatedDate = new Date(ref.created_at)
    refCreatedDate.setHours(0, 0, 0, 0)

    const isInPeriod = refCreatedDate >= periodStart && refCreatedDate <= periodEnd

    // Inclui se estiver no período E (Em Andamento OU Concluída)
    return isInPeriod && (ref.status === 'Em Andamento' || ref.status === 'Concluída')
  })
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

    // 1. Referências em Andamento (total, sem filtro de período)
    const inProgress = references.filter((ref: any) => ref.status === 'Em Andamento')
    const referencesInProgress = inProgress.length

    // 2. Referências no período de fechamento atual (reutilizado em múltiplas métricas)
    const refsInPeriod = filterByClosingPeriod(references, today)

    // 3. Valor em Produção (soma dos valores no período)
    const valueInProduction = refsInPeriod.reduce((sum: number, ref: any) => {
      return sum + (ref.amount * ref.value)
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

    // 6. Faturamento por Cliente (Top 5) - usa referências do período
    const customerRevenue: any = {}
    refsInPeriod.forEach((ref: any) => {
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

    // 7. Produção por Tipo de Serviço - usa referências do período
    const serviceTypeProduction: any = {}
    refsInPeriod.forEach((ref: any) => {
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
