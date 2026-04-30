<template>
  <div class="page-container">
    <header class="page-header">
      <h1>Dashboard Geral</h1>
      <p>Visão global das métricas do sistema e alocação de colaboradores.</p>
    </header>

    <!-- Cards de Métricas Principais -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon users-icon">👥</div>
        <div class="metric-info">
          <h3>Total de Usuários</h3>
          <p class="metric-value">{{ totalUsuarios }}</p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon companies-icon">🏢</div>
        <div class="metric-info">
          <h3>Empresas Registradas</h3>
          <p class="metric-value">{{ totalEmpresas }}</p>
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-icon collab-icon">💼</div>
        <div class="metric-info">
          <h3>Total de Colaboradores</h3>
          <p class="metric-value">{{ totalColaboradores }}</p>
        </div>
      </div>
    </div>

    <!-- Gráfico/Lista de Colaboradores por Setor -->
    <div class="card mt-2">
      <h2>Colaboradores por Departamento</h2>
      <div class="sectors-grid">
        <div v-if="Object.keys(colaboradoresPorSetor).length === 0" class="empty-state">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const totalUsuarios = ref(0)
const totalEmpresas = ref(0)
const totalColaboradores = ref(0)
const colaboradoresPorSetor = ref<Record<string, number>>({})

const carregarMetricas = async () => {
  // 1. Contar Usuários na tabela perfis
  const { count: countUsuarios } = await supabase
    .from('perfis')
    .select('*', { count: 'exact', head: true })
  totalUsuarios.value = countUsuarios || 0

  // 2. Contar Empresas
  const { count: countEmpresas } = await supabase
    .from('empresas')
    .select('*', { count: 'exact', head: true })
  totalEmpresas.value = countEmpresas || 0

  // 3. Buscar departamentos dos colaboradores para agrupar
  const { data: colaboradores } = await supabase
    .from('colaboradores')
    .select('departamento')

  if (colaboradores) {
    totalColaboradores.value = colaboradores.length
    
    // Agrupa e conta quantos colaboradores existem em cada departamento
    const agrupamento = colaboradores.reduce((acc, colab) => {
      const dept = colab.departamento || 'Não alocado'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    colaboradoresPorSetor.value = agrupamento
  }
}

onMounted(() => {
  carregarMetricas()
})
</script>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px var(--shadow-color);
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary-color);
}

.metric-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background-color: var(--bg-color);
}

.metric-info h3 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 500;
}

.metric-value {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-color);
}

.mt-2 { margin-top: 2rem; }

.sectors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.sector-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.sector-name {
  font-weight: 600;
  color: var(--primary-color);
}

.sector-count {
  background-color: var(--primary-color);
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}
</style>