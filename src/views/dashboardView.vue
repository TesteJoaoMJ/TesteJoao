<template>
  <div class="main-content">
    <header class="page-header">
      <div>
        <h1 class="page-title text-primary">Dashboard Geral</h1>
        <p class="page-subtitle">Visão global das métricas do sistema e alocação de colaboradores.</p>
      </div>
    </header>

    <!-- Estado de Carregamento -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando métricas do sistema...</p>
    </div>

    <div v-else>
      <!-- Cards de Métricas Principais -->
      <div class="metrics-grid">
        
        <!-- Total de Colaboradores -->
        <div class="card metric-card">
          <div class="metric-icon collab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <div class="metric-info">
            <h3>Total de Colaboradores</h3>
            <p class="metric-value">{{ totalColaboradores }}</p>
          </div>
        </div>

        <!-- Total de Setores -->
        <div class="card metric-card">
          <div class="metric-icon companies-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
          </div>
          <div class="metric-info">
            <h3>Setores Registrados</h3>
            <p class="metric-value">{{ totalEmpresas }}</p>
          </div>
        </div>

        <!-- Usuários do Sistema -->
        <div class="card metric-card">
          <div class="metric-icon users-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          </div>
          <div class="metric-info">
            <h3>Usuários com Acesso</h3>
            <p class="metric-value">{{ totalUsuarios }}</p>
          </div>
        </div>

      </div>

      <!-- Gráfico/Lista de Colaboradores por Setor -->
      <div class="card" style="padding: 1.5rem;">
        <h2 style="margin-top: 0; color: var(--text-main); font-size: 1.25rem;">Colaboradores por Setor</h2>
        
        <div class="sectors-grid">
          <div v-if="Object.keys(colaboradoresPorSetor).length === 0" class="empty-state-simple" style="grid-column: 1 / -1;">
            Nenhum colaborador alocado ainda.
          </div>
          
          <div 
            v-for="(quantidade, departamento) in colaboradoresPorSetor" 
            :key="departamento" 
            class="sector-stat"
          >
            <span class="sector-name">{{ departamento }}</span>
            <span class="sector-count">{{ quantidade }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const loading = ref(true)
const totalUsuarios = ref(0)
const totalEmpresas = ref(0)
const totalColaboradores = ref(0)
const colaboradoresPorSetor = ref<Record<string, number>>({})

const carregarMetricas = async () => {
  loading.value = true

  // 1. Contar Usuários na tabela perfis (Quem tem acesso ao sistema)
  const { count: countUsuarios } = await supabase
    .from('perfis')
    .select('*', { count: 'exact', head: true })
  totalUsuarios.value = countUsuarios || 0

  // 2. Contar Setores/Empresas (Tabela de setores)
  const { count: countEmpresas } = await supabase
    .from('empresas')
    .select('*', { count: 'exact', head: true })
  totalEmpresas.value = countEmpresas || 0

  // 3. Buscar departamentos dos colaboradores para agrupar e somar o total
  const { data: colaboradores } = await supabase
    .from('colaboradores')
    .select('departamento')

  if (colaboradores) {
    totalColaboradores.value = colaboradores.length
    
    // Agrupa e conta quantos colaboradores existem em cada departamento
    const agrupamento = colaboradores.reduce((acc, colab) => {
      // Se não tiver departamento, coloca como "Não alocado"
      const dept = colab.departamento || 'Não alocado'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    colaboradoresPorSetor.value = agrupamento
  }

  loading.value = false
}

onMounted(() => {
  carregarMetricas()
})
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
}

.metric-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.metric-icon svg {
  width: 28px;
  height: 28px;
}

/* Cores específicas para os ícones baseadas no seu design system */
.collab-icon {
  background-color: var(--primary-bg);
  color: var(--primary);
}

.companies-icon {
  background-color: var(--success-bg);
  color: var(--success);
}

.users-icon {
  background-color: rgba(245, 158, 11, 0.15); /* Tom de alerta/laranja suave */
  color: #d97706;
}

.metric-info h3 {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.sectors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.sector-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: var(--bg-app);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.sector-stat:hover {
  background-color: var(--bg-surface-hover);
}

.sector-name {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
}

.sector-count {
  background-color: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: bold;
  font-size: 0.85rem;
}
</style>