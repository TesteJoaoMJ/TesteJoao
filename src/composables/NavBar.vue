<template>
  <header class="navbar">
    <LoadingView :isVisible="isFirstLoad" title="Bem Vindo!" message="Preparando seu ambiente, aguarde um momento..." />
    <LoadingView :isVisible="isLoggingOut" title="Até Logo" message="Encerrando a sessão de forma segura..." />

    <div class="navbar-left">
      <div class="seletor-grupo">
        <label class="seletor-label">Selecione a empresa</label>
        <div v-if="isLoading" class="skeleton-item rounded" style="width: 200px; height: 35px;"></div>
        <select 
          v-else
          v-model="tenantStore.selectedEmpresaId" 
          class="navbar-select"
          :disabled="isLoading"
          @change="emitirMudancaEmpresa"
        >
          <option disabled value="">Selecione uma empresa</option>
          <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
            {{ empresa.nome }}
          </option>
        </select>
      </div>
    </div>

    <div class="navbar-right">
      <template v-if="userRole === 'admin' && !isLoading">
        <div class="action-bar" style="display: flex; align-items: center;"> 
          <button class="btn-white" @click="lidarComAcoesRapidas('novo_usuario')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; color: var(--primary);">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            Novo Usuário
          </button>
              
          <button class="btn-white" @click="lidarComAcoesRapidas('novo_setor')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; color: var(--success);">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Novo Setor
          </button>
        </div>
      </template>

      <div class="nav-divider"></div>
        
      <template v-if="isLoading">
        <div class="skeleton-item rounded" style="width: 140px; height: 20px;"></div>
        <div class="skeleton-item rounded-full" style="width: 60px; height: 24px;"></div>
      </template>
      <template v-else>
        <div class="user-info" style="display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2;">
          <span v-if="userRole" class="badge" :class="userRole === 'admin' ? 'ativo' : 'user'" style="font-size: 0.7rem; margin-top: 2px;">
            {{ userRole.toUpperCase() }}
          </span>
          <span class="user-email" style="font-size: 0.9rem; font-weight: 500;">{{ usuarioAtual?.email || 'Carregando...' }}</span>
        </div>
      </template>
        
      <button @click="toggleTheme" class="btn-white btn-icon" :data-tooltip="theme === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'">
        <span v-if="theme === 'light'">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
          </svg>
        </span>
        <span v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="yellow" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        </span>
      </button>

      <button class="btn-outline danger" @click="handleLogout" data-tooltip="Sair do Sistema">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px; vertical-align: middle;">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
        Sair
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase' // Verifique se o caminho está correto
import { useTheme } from '../composables/useDarkMode' // Verifique se o caminho está correto
import { useTenantStore } from '@/stores/tenant' // Verifique se o caminho está correto
import LoadingView from '../composables/LoadingView.vue'; // Verifique se o caminho está correto

const emit = defineEmits(['empresaMudou'])

const isFirstLoad = ref(true)
const isLoading = ref(false)
const isLoggingOut = ref(false)

const empresas = ref<{ id: string, nome: string }[]>([])
const tenantStore = useTenantStore()
const { theme, toggleTheme } = useTheme()
const router = useRouter()
const userRole = ref<string>('user')
const usuarioAtual = ref<any>(null)

async function fetchEmpresas() {
  const { data, error } = await supabase.from('empresas').select('id, nome').order('nome')
  if (error) {
    console.error('Erro ao carregar empresas:', error)
    return
  }
  empresas.value = data || []
  if (!tenantStore.selectedEmpresaId && empresas.value.length > 0) {
    tenantStore.selectedEmpresaId = empresas.value[0]?.id || ''
  }
}

const lidarComAcoesRapidas = (acao: string) => {
  if (acao === 'novo_usuario') {
      router.push('/usuarios')
  } else if (acao === 'novo_setor') {
    router.push('/setores')
  }
}

const emitirMudancaEmpresa = () => {
  emit('empresaMudou')
}

const handleLogout = async () => { 
  isLoggingOut.value = true;
  setInterval(() => {
    supabase.auth.signOut();
    router.push('/') 
  }, 2000);
}

onMounted(async () => {
  isLoading.value = true 
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) { 
    router.push('/')
    return 
  }
  
  usuarioAtual.value = session.user
  
  const { data: perfil } = await supabase.from('perfis').select('role').eq('id', session.user.id).single()
  userRole.value = perfil?.role || 'user'
  
  await fetchEmpresas()
  
  setTimeout(() => { 
    isFirstLoad.value = false 
    isLoading.value = false
  }, 800)
})
</script>

<style scoped>
/* Estilos extraídos do seu home.css[cite: 3] específicos para a navegação */
.navbar {
  background: var(--bg-surface);
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, border 0.3s;
}

.navbar-left, .navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.seletor-grupo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.seletor-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

.navbar-select {
  background-color: var(--bg-surface-hover);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none; 
  -webkit-appearance: none;
}

.navbar-select option {
  background-color: var(--bg-surface);
  color: var(--text-main);
  text-align: center;
}

.navbar-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.action-bar {
  display: flex;
  gap: 0.75rem;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background-color: var(--border);
  margin: 0 0.5rem;
}

/* Modificadores de Badge e Tooltip que estão na Nav[cite: 3] */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge.user { background: var(--warning); color: var(--text-primary); }
.badge.ativo { background: var(--success-bg); color: var(--success); }

/* Skeletons para o carregamento do topo[cite: 3] */
.skeleton-item {
  background: var(--bg-skeleton, #eee);
  position: relative;
  overflow: hidden;
}
.skeleton-item::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, var(--bg-skeleton-shimmer, rgba(255, 255, 255, 0.5)), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
.rounded { border-radius: 6px; }
.rounded-full { border-radius: 9999px; }

/* Botões da Navbar[cite: 3] */
button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
}
.btn-white {
  background: var(--bg-surface);
  color: var(--text-main);
  border: 1px solid var(--border); 
  border-radius: 6px; 
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.btn-white:hover {
  filter: brightness(0.95);
  border-color: var(--border); 
}
.btn-icon {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 5px;
}
.btn-icon:hover {
  background-color: var(--bg-app);
  color: var(--primary);
}
.btn-outline.danger {
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-muted);
}
.btn-outline.danger:hover {
  background: var(--danger);
  color: var(--text-main);
}
.user-email{
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-main);
}
</style>