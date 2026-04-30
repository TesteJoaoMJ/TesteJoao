<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const novoUsuarioForm = ref({ 
  email: '', 
  password: '', 
  confirmPassword: '', 
  role: 'user'
})

const errosAuth = ref({ 
  email: '', 
  password: '', 
  confirmPassword: '',
  geral: ''
})

interface Usuario {
  id?: string
  email: string
  created_at: string 
  role: string
}

const ModelUsuarios = ref<Usuario[]>([])
const loading = ref(true)
const isSalvando = ref(false)

const fetchUsuarios = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .order('email', { ascending: true })

  if (!error && data) {
    ModelUsuarios.value = data
  }
  loading.value = false
}

const cadastrarUsuario = async () => {
  errosAuth.value = { email: '', password: '', confirmPassword: '', geral: '' }

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

  await fetchUsuarios()

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

    <!-- FORMULÁRIO DE CADASTRO -->
    <div class="card form-section">
      <div class="form-header">
        <h2>Cadastrar Novo Usuário</h2>
      </div>
      
      <div v-if="errosAuth.geral" class="erro-mensagem">
        {{ errosAuth.geral }}
      </div>

      <form @submit.prevent="cadastrarUsuario" class="form-body">
        <div class="form-grid">
          <div class="input-group">
            <label>E-mail</label>
            <input type="email" v-model="novoUsuarioForm.email" placeholder="exemplo@email.com" required />
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
            <input type="password" v-model="novoUsuarioForm.password" placeholder="Mínimo 6 caracteres" required />
            <span class="erro-texto" v-if="errosAuth.password">{{ errosAuth.password }}</span>
          </div>

          <div class="input-group">
            <label>Confirmar Senha</label>
            <input type="password" v-model="novoUsuarioForm.confirmPassword" placeholder="Repita a senha" required />
            <span class="erro-texto" v-if="errosAuth.confirmPassword">{{ errosAuth.confirmPassword }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-salvar" :disabled="isSalvando">
            {{ isSalvando ? 'Cadastrando...' : 'Cadastrar Usuário' }}
          </button>
        </div>
      </form>
    </div>

    <!-- LISTA DE USUÁRIOS -->
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
          <tr v-for="usuario in ModelUsuarios" :key="usuario.email" class="table-row">
            <td class="email-cell">{{ usuario.email }}</td>
            <td>{{ formatDate(usuario.created_at) }}</td>
            <td>
              <span :class="['badge', usuario.role === 'admin' ? 'badge-admin' : 'badge-user']">
                {{ usuario.role.toUpperCase() }}
              </span>
            </td>
          </tr>
          <tr v-if="ModelUsuarios.length === 0">
            <td colspan="3" style="text-align: center; padding: 2rem;">Nenhum usuário encontrado.</td>
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

.input-group input,
.input-group select {
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.9rem;
  background: var(--bg-app);
  color: var(--text-main);
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus,
.input-group select:focus {
  border-color: var(--primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.btn-salvar {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
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
  font-weight: 500;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.badge-admin {
  background-color: var(--success-bg, #dcfce7);
  color: var(--success, #059669);
  border: 1px solid var(--success);
}

.badge-user {
  background-color: var(--bg-surface-hover);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>