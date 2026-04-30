<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// Estado do Formulário
const novoUsuarioForm = ref({ 
  email: '', 
  password: '', 
  confirmPassword: '', 
  role: 'user'
})

// Controle de Erros
const errosAuth = ref({ 
  email: '', 
  password: '', 
  confirmPassword: '',
  geral: ''
})

// Interface corrigida (O padrão do Supabase é created_at, mas se no seu banco for 'creat', altere aqui)
interface Usuario {
  id?: string
  email: string
  created_at: string 
  role: string
}

const ModelUsuarios = ref<Usuario[]>([])
const loading = ref(true)
const isSalvando = ref(false)

// Busca os usuários na tabela perfis
const fetchUsuarios = async () => {
  loading.value = true
  
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .order('role', { ascending: true })

  if (!error && data) {
    ModelUsuarios.value = data
  }
  
  loading.value = false
}

// Lógica de Cadastro
const cadastrarUsuario = async () => {
  // 1. Limpa os erros anteriores
  errosAuth.value = { email: '', password: '', confirmPassword: '', geral: '' }

  // 2. Validação simples de senha
  if (novoUsuarioForm.value.password !== novoUsuarioForm.value.confirmPassword) {
    errosAuth.value.confirmPassword = 'As senhas não coincidem.'
    return
  }
  
  if (novoUsuarioForm.value.password.length < 6) {
    errosAuth.value.password = 'A senha deve ter pelo menos 6 caracteres.'
    return
  }

  isSalvando.value = true

  
  const infoDispositivo = navigator.userAgent
  let ipUsuario = 'Desconhecido'
  let localUsuario = 'Desconhecido'

  try {
    const respostaLocal = await fetch('https://ipinfo.io/json')
    const dadosLocal = await respostaLocal.json()
      
    if (dadosLocal.ip) {
      ipUsuario = dadosLocal.ip
      localUsuario = `${dadosLocal.city}, ${dadosLocal.region} - ${dadosLocal.country}`
    }
  } catch (e) {
    console.warn('Falha ao buscar localização: ', e)
  }


  // 2. O cadastro só deve prosseguir após o bloco acima
  const { error } = await supabase.auth.signUp({
    email: novoUsuarioForm.value.email,
    password: novoUsuarioForm.value.password,
    options: { 
      data: { 
        role: novoUsuarioForm.value.role,
        ip: ipUsuario,
        localizacao: localUsuario,
        dispositivo: infoDispositivo
      } 
    }
  });


  if (error) {
    errosAuth.value.geral = error.message
    isSalvando.value = false
    return
  }

  // 4. Recarrega a lista de usuários sozinho após o cadastro
  await fetchUsuarios()

  // 5. Limpa o formulário
  novoUsuarioForm.value = {
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  }

  isSalvando.value = false
}

const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('pt-BR')
}

onMounted(fetchUsuarios)
</script>

<template>
  <div class="gerenciamento-container">
    <header class="page-header">
      <h1 class="text-primary">Gerenciamento de Usuários</h1>
      <p>Cadastre novos acessos e visualize os usuários do sistema</p>
    </header>

    <!-- FORMULÁRIO DE CADASTRO (Parte de cima) -->
    <section class="card form-section">
      <h2>Cadastrar Novo Usuário</h2>
      
      <div v-if="errosAuth.geral" class="erro-mensagem">
        {{ errosAuth.geral }}
      </div>

      <form @submit.prevent="cadastrarUsuario" class="form-grid">
        
        <div class="input-group">
          <label>E-mail</label>
          <input 
            type="email" 
            v-model="novoUsuarioForm.email" 
            placeholder="exemplo@email.com" 
            required 
          />
        </div>

        <div class="input-group">
          <label>Permissão (Role)</label>
          <select v-model="novoUsuarioForm.role" required>
            <option value="user">Usuário Padrão</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input 
            type="password" 
            v-model="novoUsuarioForm.password" 
            placeholder="Mínimo 6 caracteres" 
            required 
          />
          <span class="erro-texto" v-if="errosAuth.password">{{ errosAuth.password }}</span>
        </div>

        <div class="input-group">
          <label>Confirmar Senha</label>
          <input 
            type="password" 
            v-model="novoUsuarioForm.confirmPassword" 
            placeholder="Repita a senha" 
            required 
          />
          <span class="erro-texto" v-if="errosAuth.confirmPassword">{{ errosAuth.confirmPassword }}</span>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-salvar" :disabled="isSalvando">
            {{ isSalvando ? 'Cadastrando...' : 'Cadastrar Usuário' }}
          </button>
        </div>

      </form>
    </section>

    <!-- LISTA DE USUÁRIOS (Parte de baixo) -->
    <section class="lista-section">
      <h3>Usuários Cadastrados</h3>
      
      <div v-if="loading" class="loading-state">
        <p>Carregando registros...</p>
      </div>

      <div v-else class="table-wrapper card">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Data de Criação</th>
              <th>Permissão (Role)</th>
            </tr>
          </thead>
          <tbody>
            <!-- Erro de v-for corrigido (adicionado o :key) -->
            <tr v-for="usuario in ModelUsuarios" :key="usuario.email" class="table-row">
              <td class="email-cell">{{ usuario.email }}</td>
              <td>{{ formatDate(usuario.created_at) }}</td>
              <td class="role-badge">
                <span :class="['badge', usuario.role === 'admin' ? 'badge-admin' : 'badge-user']">
                  {{ usuario.role }}
                </span>
              </td>
            </tr>
            <tr v-if="ModelUsuarios.length === 0">
              <td colspan="3" style="text-align: center;">Nenhum usuário encontrado.</td>
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