<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Empresa {
  id?: string
  nome: string
  created_at: string 
}

const nomeSetor = ref('')
const ModelEmpresas = ref<Empresa[]>([])
const loading = ref(true)
const isSalvando = ref(false)
const erroGeral = ref('')

// Busca as empresas/setores
const fetchEmpresas = async () => {
  loading.value = true
  
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .order('nome', { ascending: true })

  if (!error && data) {
    ModelEmpresas.value = data
  }
  
  loading.value = false
}

// Lógica corrigida: Cadastra um novo Setor/Empresa ao invés de um usuário Auth
const cadastrarSetor = async () => {
  erroGeral.value = ''
  if (!nomeSetor.value.trim()) {
    erroGeral.value = 'O nome do setor é obrigatório.'
    return
  }

  isSalvando.value = true

  const { error } = await supabase
    .from('empresas')
    .insert([{ nome: nomeSetor.value }])

  if (error) {
    erroGeral.value = error.message
  } else {
    // Recarrega a lista e limpa o formulário
    nomeSetor.value = ''
    await fetchEmpresas()
  }

  isSalvando.value = false
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('pt-BR')
}

onMounted(fetchEmpresas)
</script>

<template>
  <div class="main-content">
    <header class="page-header">
      <div>
        <h1 class="page-title text-primary">Gerenciamento de Setores</h1>
        <p class="page-subtitle">Cadastre e visualize os departamentos da empresa</p>
      </div>
    </header>

    <!-- FORMULÁRIO DE CADASTRO -->
    <section class="card" style="margin-bottom: 2rem;">
      <div class="form-body">
        <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-main);">Cadastrar Novo Setor</h3>
        
        <div v-if="erroGeral" class="error-message" style="margin-bottom: 1rem;">
          {{ erroGeral }}
        </div>

        <form @submit.prevent="cadastrarSetor" class="form-grid" style="grid-template-columns: 1fr; gap: 1.5rem;">
          
          <div class="input-field">
            <label>Nome do Setor / Empresa</label>
            <input 
              type="text" 
              v-model="nomeSetor" 
              placeholder="Ex: Recursos Humanos" 
              required 
            />
          </div>

          <div class="action-buttons" style="justify-content: flex-start;">
            <button type="submit" class="btn-white" :disabled="isSalvando" style="background-color: var(--primary); color: white; border: none;">
              {{ isSalvando ? 'Cadastrando...' : 'Cadastrar Setor' }}
            </button>
          </div>

        </form>
      </div>
    </section>

    <!-- LISTA DE SETORES -->
    <section>
      <h3 style="color: var(--text-main); margin-bottom: 1rem;">Setores Cadastrados</h3>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando registros...</p>
      </div>

      <div v-else class="card-grid">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nome do Setor</th>
              <th>Data de Criação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empresa in ModelEmpresas" :key="empresa.id">
              <td class="user-name">{{ empresa.nome }}</td>
              <td>{{ formatDate(empresa.created_at) }}</td>
            </tr>
            <tr v-if="ModelEmpresas.length === 0">
              <td colspan="2" class="empty-state-simple">Nenhum setor encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* A maioria do CSS já vem do seu arquivo global de estilos (source: 5 e 6). 
   Aqui fica apenas pequenos ajustes estruturais se necessário. */
</style>