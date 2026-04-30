<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface LoginHistory {
  id: string
  user_email: string
  ip: string
  localizacao: string
  dispositivo: string
  data_login: string
}

const history = ref<LoginHistory[]>([])
const loading = ref(true)

const fetchAuditLog = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('historico_logins')
    .select('*')
    .order('data_login', { ascending: false })

  if (!error) {
    history.value = data
  }
  loading.value = false
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('pt-BR')
}

onMounted(fetchAuditLog)
</script>

<template>
  <div class="audit-container">
    <header class="page-header">
      <h1 class="text-primary">Auditoria de Logins</h1>
      <p>Monitoramento em tempo real de acessos ao sistema</p>
    </header>

    <div v-if="loading" class="loading-state">
      <p>Carregando registros...</p>
    </div>

    <div v-else class="table-wrapper card">
      <table class="audit-table">
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Data/Hora</th>
            <th>IP</th>
            <th>Localização</th>
            <th>Dispositivo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in history" :key="log.id" class="table-row">
            <td class="email-cell">{{ log.user_email }}</td>
            <td>{{ formatDate(log.data_login) }}</td>
            <td class="ip-badge">{{ log.ip }}</td>
            <td>{{ log.localizacao }}</td>
            <td class="device-cell" :title="log.dispositivo">
              {{ log.dispositivo.split(') ')[1] || log.dispositivo.substring(0, 30) }}...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

* {
  box-sizing: border-box;
  font-family: 'Inter', system-ui, sans-serif;
}

.audit-container {
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-main);
  transition: background-color 0.3s, color 0.3s;
  padding: 0.75rem 2rem;
}

.page-header h1 {
  background: var(--bg-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, border 0.3s;
  width: 100%;
}


.card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: var(--table-header-bg);
  padding: 1rem;
  text-align: left;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}

.table-row:hover {
  background-color: var(--bg-surface-hover);
}

.email-cell {
  font-weight: 500;
  color: var(--text-main);
}

.ip-badge {
  color: #059669; /* Verde para destacar o IP */
  font-family: monospace;
}

.device-cell {
  color: var(--text-main);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>