<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// Tipagem para facilitar o autocompletar e evitar erros
interface Empresa {
  id: string
  nome: string
  created_at: string
}

// Estado do Formulário
const novoSetor = ref({ 
  nome: '', 
})

// Lista onde guardaremos os setores (empresas) que vêm do banco
const setores = ref<Empresa[]>([])

// Controle de Erros e Loading
const errosSetor = ref({ 
  nome: '', 
  geral: ''
})

const loading = ref(true)
const isSalvando = ref(false)

// Busca os setores na tabela 'empresas' do seu banco de dados
const fetchSetores = async () => {
  loading.value = true
  errosSetor.value.geral = ''
  
  const { data, error } = await supabase
    .from('empresas') // Corrigido para apontar para a tabela correta
    .select('*')
    .order('nome', { ascending: true })

  if (error) {
    errosSetor.value.geral = 'Erro ao buscar setores: ' + error.message
  } else {
    setores.value = data || []
  }

  loading.value = false
}

// Lógica de Cadastro
const cadastrarSetor = async () => {
  // 1. Limpa os erros anteriores
  errosSetor.value = { nome: '', geral: '' }

  // 2. Validação simples de nome
  if (!novoSetor.value.nome) {
    errosSetor.value.nome = 'O nome do setor é obrigatório.'
    return
  }

  isSalvando.value = true

  // 3. Insere no Supabase
  const { error } = await supabase
    .from('empresas')
    .insert([{ nome: novoSetor.value.nome }])

  if (error) {
    errosSetor.value.geral = 'Erro ao cadastrar setor: ' + error.message
  } else {
    // 4. Recarrega a lista de setores sozinho após o cadastro
    await fetchSetores()

    // 5. Limpa o formulário
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

    <!-- FORMULÁRIO DE CADASTRO (Parte de cima) -->
    <section class="card form-section">
      <h2>Cadastrar Novo Setor</h2>
      
      <div v-if="errosSetor.geral" class="erro-mensagem">
        {{ errosSetor.geral }}
      </div>

      <form @submit.prevent="cadastrarSetor" class="form-grid">
        
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

        <div class="form-actions">
          <button type="submit" class="btn-salvar" :disabled="isSalvando">
            {{ isSalvando ? 'Cadastrando...' : 'Cadastrar Setor' }}
          </button>
        </div>

      </form>
    </section>

    <!-- LISTA DE SETORES (Parte de baixo) -->
    <section class="lista-section">
      <h3>Setores Cadastrados</h3>
      
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
            <!-- V-for corrigido para iterar na lista de setores que veio do banco -->
            <tr v-for="setor in setores" :key="setor.id" class="table-row">
              <td class="nome-cell"><strong>{{ setor.nome }}</strong></td>
              <td>{{ formatDate(setor.created_at) }}</td>
              <td class="id-cell">{{ setor.id.substring(0, 8) }}...</td>
            </tr>
            
            <!-- Mensagem caso a lista esteja vazia -->
            <tr v-if="setores.length === 0">
              <td colspan="3" style="text-align: center; padding: 2rem;">Nenhum setor cadastrado ainda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  font-family: 'Inter', system-ui, sans-serif;
}

.gerenciamento-container {
  min-height: 100vh;
  background-color: var(--bg-app, #f8fafc);
  color: var(--text-main, #0f172a);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
  color: var(--primary-color, #2563eb);
}

.page-header p {
  color: #64748b;
  margin: 0;
}

.card {
  background: var(--bg-card, #ffffff);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  overflow: hidden;
}

/* ESTILOS DO FORMULÁRIO */
.form-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  align-items: end; /* Alinha o botão com o input */
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr auto; /* Input ocupa o espaço restante, botão ocupa o necessário */
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: #3b82f6;
  background: #ffffff;
}

.form-actions {
  margin-top: 0;
}

.btn-salvar {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 46px; /* Altura igual ao input */
}

.btn-salvar:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-salvar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.erro-texto {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.erro-mensagem {
  background-color: #fef2f2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #fca5a5;
}

/* ESTILOS DA TABELA */
.lista-section h3 {
  margin-bottom: 1rem;
  color: var(--text-main);
}

.table-wrapper {
  padding: 0;
  overflow-x: auto;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: var(--table-header-bg, #f1f5f9);
  padding: 1rem;
  text-align: left;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid var(--border, #e2e8f0);
}

td {
  padding: 1rem;
  border-bottom: 1px solid var(--border, #e2e8f0);
  font-size: 0.9rem;
}

.table-row:hover {
  background-color: var(--bg-surface-hover, #f8fafc);
}

.nome-cell {
  color: var(--primary-color, #2563eb);
}

.id-cell {
  font-family: monospace;
  color: #94a3b8;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

/* Tema Escuro (Aproveitando a responsividade de cor solicitada antes) */
@media (prefers-color-scheme: dark) {
  .gerenciamento-container {
    --bg-app: #0f172a;
    --text-main: #f8fafc;
    --primary-color: #60a5fa;
  }
  .card {
    --bg-card: #1e293b;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }
  .input-group label, th {
    color: #94a3b8;
  }
  .input-group input {
    background: #0f172a;
    border-color: #334155;
    color: white;
  }
  th, td {
    --border: #334155;
  }
  th {
    --table-header-bg: #0f172a;
  }
  .table-row:hover {
    --bg-surface-hover: #334155;
  }
}
</style>