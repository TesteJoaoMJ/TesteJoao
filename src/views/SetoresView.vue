<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Empresa {
  id: string
  nome: string
  created_at: string 
}

const novoSetor = ref({ nome: '' })
const setores = ref<Empresa[]>([])

const errosSetor = ref({ nome: '', geral: '' })
const loading = ref(true)
const isSalvando = ref(false)

const fetchSetores = async () => {
  loading.value = true
  errosSetor.value.geral = ''
  
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .order('nome', { ascending: true })

  if (error) {
    errosSetor.value.geral = 'Erro ao buscar setores: ' + error.message
  } else {
    setores.value = data || []
  }
  loading.value = false
}

const cadastrarSetor = async () => {
  errosSetor.value = { nome: '', geral: '' }

  if (!novoSetor.value.nome) {
    errosSetor.value.nome = 'O nome do setor é obrigatório.'
    return
  }

  isSalvando.value = true

  const { error } = await supabase
    .from('empresas')
    .insert([{ nome: novoSetor.value.nome }])

  if (error) {
    errosSetor.value.geral = 'Erro ao cadastrar setor: ' + error.message
  } else {
    await fetchSetores()
    novoSetor.value.nome = ''
  }

  isSalvando.value = false
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(fetchSetores)
</script>

<template>
  <div class="gerenciamento-container">
    <header class="page-header">
      <h1 class="text-primary">Gerenciamento de Setores</h1>
      <p>Cadastre novos setores/empresas e visualize os existentes</p>
    </header>

    <!-- FORMULÁRIO DE CADASTRO -->
    <div class="card form-section">
      <div class="form-header">
        <h2>Cadastrar Novo Setor</h2>
      </div>
      
      <div v-if="errosSetor.geral" class="erro-mensagem">
        {{ errosSetor.geral }}
      </div>

      <form @submit.prevent="cadastrarSetor" class="form-body">
        <div class="form-grid-single">
          <div class="input-group">
            <label>Nome do Setor</label>
            <input 
              type="text" 
              v-model="novoSetor.nome" 
              placeholder="Ex: MJ - Sistema Comercial" 
              required 
            />
            <span v-if="errosSetor.nome" class="erro-texto">{{ errosSetor.nome }}</span>
          </div>
          
          <div class="form-actions-inline">
            <button type="submit" class="btn-salvar" :disabled="isSalvando">
              {{ isSalvando ? 'Cadastrando...' : 'Cadastrar Setor' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- LISTA DE SETORES -->
    <div v-if="loading" class="loading-state">
      <p>Carregando registros...</p>
    </div>

    <div v-else class="table-wrapper card">
      <table class="audit-table">
        <thead>
          <tr>
            <th>Nome do Setor</th>
            <th>Data de Criação</th>
            <th>ID Referência</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="setor in setores" :key="setor.id" class="table-row">
            <td class="email-cell">{{ setor.nome }}</td>
            <td>{{ formatDate(setor.created_at) }}</td>
            <td class="id-cell">{{ setor.id.substring(0, 8) }}...</td>
          </tr>
          <tr v-if="setores.length === 0">
            <td colspan="3" style="text-align: center; padding: 2rem;">Nenhum setor cadastrado ainda.</td>
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

.gerenciamento-container {
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--text-main);
  transition: background-color 0.3s, color 0.3s;
  padding: 0.75rem 2rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-header h1 {
  color: var(--primary);
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.page-header p {
  color: var(--text-muted);
  margin: 0;
}

.card {
  background: var(--bg-card, var(--bg-surface));
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
}

/* ESTILOS DO FORMULÁRIO */
.form-header {
  background: var(--table-header-bg);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.form-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-main);
}

.form-body {
  padding: 1.5rem;
}

.form-grid-single {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--bg-app);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s;
  height: 42px; /* Força alinhamento de altura com botão */
}

.input-group input:focus {
  border-color: var(--primary);
}

.form-actions-inline .btn-salvar {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
  height: 42px; /* Mesmo tamanho do input */
}

.btn-salvar:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-salvar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.erro-texto {
  color: var(--danger, #ef4444);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.erro-mensagem {
  background-color: var(--danger-bg, #fef2f2);
  color: var(--danger, #b91c1c);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}

/* ESTILOS DA TABELA (Igual Auditoria) */
.audit-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: var(--table-header-bg);
  padding: 1rem 1.5rem;
  text-align: left;
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
  color: var(--text-main);
}

.table-row:hover {
  background-color: var(--bg-surface-hover);
}

.email-cell {
  font-weight: 600;
  color: var(--text-main);
}

.id-cell {
  font-family: monospace;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .form-grid-single {
    grid-template-columns: 1fr;
  }
}
</style>