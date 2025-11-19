<template>
  <div class="home">
    <div class="header-navbar">
      <div class="header-box">
        <NavbarMenu />
        <Avatar
          :label="userInitial"
          shape="circle"
          class="user-avatar"
        />
      </div>
    </div>

    <div class="home-content">
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <ProgressSpinner />
      </div>

      <!-- Dashboard -->
      <div v-else class="dashboard">
        <!-- Cards de Métricas -->
        <div class="metrics-grid">
          <Card class="metric-card">
            <template #content>
              <div class="metric-content">
                <i class="pi pi-clock metric-icon" style="color: #3b82f6"></i>
                <div class="metric-info">
                  <span class="metric-label">Em Andamento</span>
                  <span class="metric-value">{{ metrics.referencesInProgress }}</span>
                </div>
              </div>
            </template>
          </Card>

          <Card class="metric-card">
            <template #content>
              <div class="metric-content">
                <i class="pi pi-dollar metric-icon" style="color: #10b981"></i>
                <div class="metric-info">
                  <span class="metric-label">Valor em Produção</span>
                  <span class="metric-value">{{ formatCurrency(metrics.valueInProduction) }}</span>
                </div>
              </div>
            </template>
          </Card>

          <Card class="metric-card alert-card">
            <template #content>
              <div class="metric-content">
                <i class="pi pi-exclamation-triangle metric-icon" style="color: #ef4444"></i>
                <div class="metric-info">
                  <span class="metric-label">Atrasadas</span>
                  <span class="metric-value">{{ metrics.referencesOverdue }}</span>
                </div>
              </div>
            </template>
          </Card>

          <Card class="metric-card">
            <template #content>
              <div class="metric-content">
                <i class="pi pi-check-circle metric-icon" style="color: #8b5cf6"></i>
                <div class="metric-info">
                  <span class="metric-label">Concluídas (mês)</span>
                  <span class="metric-value">{{ metrics.referencesCompletedThisMonth }}</span>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Gráficos -->
        <div class="charts-grid">
          <!-- Gráfico de Pizza: Referências por Status -->
          <Card class="chart-card">
            <template #header>
              <h3 class="chart-title">Referências por Status</h3>
            </template>
            <template #content>
              <Chart type="pie" :data="statusChartData" :options="chartOptions" />
            </template>
          </Card>

          <!-- Gráfico de Barras: Faturamento por Cliente -->
          <Card class="chart-card">
            <template #header>
              <h3 class="chart-title">Top 5 Clientes (Valor em Produção)</h3>
            </template>
            <template #content>
              <Chart type="bar" :data="revenueChartData" :options="barChartOptions" />
            </template>
          </Card>

          <!-- Gráfico de Barras: Produção por Tipo de Serviço -->
          <Card class="chart-card">
            <template #header>
              <h3 class="chart-title">Produção por Tipo de Serviço</h3>
            </template>
            <template #content>
              <Chart type="bar" :data="serviceChartData" :options="barChartOptions" />
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NavbarMenu from '@/global/components/NavbarMenu.vue'
import Avatar from 'primevue/avatar'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '@/stores/authStore'
import { getDashboardMetrics, type DashboardMetrics } from '@/services/dashboardService'

const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const metrics = ref<DashboardMetrics>({
  referencesInProgress: 0,
  valueInProduction: 0,
  referencesOverdue: 0,
  referencesCompletedThisMonth: 0,
  referencesByStatus: { labels: [], data: [] },
  revenueByCustomer: { labels: [], data: [] },
  productionByServiceType: { labels: [], data: [] }
})

const userInitial = computed(() => {
  const name = authStore.userName || authStore.userEmail
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Configurações dos gráficos
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Dados dos gráficos
const statusChartData = computed(() => ({
  labels: metrics.value.referencesByStatus.labels,
  datasets: [
    {
      data: metrics.value.referencesByStatus.data,
      backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
      hoverBackgroundColor: ['#2563eb', '#059669', '#dc2626']
    }
  ]
}))

const revenueChartData = computed(() => ({
  labels: metrics.value.revenueByCustomer.labels,
  datasets: [
    {
      label: 'Valor (R$)',
      data: metrics.value.revenueByCustomer.data,
      backgroundColor: '#10b981',
      borderColor: '#059669',
      borderWidth: 1
    }
  ]
}))

const serviceChartData = computed(() => ({
  labels: metrics.value.productionByServiceType.labels,
  datasets: [
    {
      label: 'Quantidade de Peças',
      data: metrics.value.productionByServiceType.data,
      backgroundColor: '#8b5cf6',
      borderColor: '#7c3aed',
      borderWidth: 1
    }
  ]
}))

// Buscar métricas
const loadMetrics = async () => {
  loading.value = true
  try {
    const response = await getDashboardMetrics()

    if (response.success && response.data) {
      metrics.value = response.data
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.error || 'Erro ao carregar métricas',
        life: 3000
      })
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Erro inesperado ao carregar métricas',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMetrics()
})
</script>

<style scoped lang="scss">
.home {
  padding: 0;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header-navbar {
  display: flex;
  justify-content: start;
  background-color: #2f1c6a;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
}

.user-avatar {
  background-color: #b3a2d4 !important;
  color: #fff !important;
  font-weight: 600;
}

.home-content {
  padding: 1.5rem;
  margin-top: 60px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.dashboard {
  font-family: Avenir, Helvetica, sans-serif;
}

.dashboard-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

// Cards de Métricas
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.metric-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &.alert-card:hover {
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem;
}

.metric-icon {
  font-size: 3rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 2rem;
  color: #2c3e50;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

// Gráficos
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 1.125rem;
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem;
  }
}
</style>
