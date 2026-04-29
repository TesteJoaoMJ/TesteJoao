<template>
  <div class="app-container header">
    <header class="navbar">
      <div class="navbar-left">
        <div class="seletor-grupo">
          <label class="seletor-label">Selecione a empresa</label>
          <select class="navbar-select">
            <option value="MJ - Sistema RH">MJ - Sistema RH</option>
            <option value="MJ - Sistema Vendas">MJ - Sistema Vendas</option>
            <option value="MJ - Sistema Financeiro">MJ - Sistema Financeiro</option>
          </select>
        </div>
      </div>
      <div class="navbar-right">
        <div class="nav-divider"></div>
        <div class="user-profile">
          <span class="user-email">{{ usuarioAtual?.email || 'Carregando...' }}</span>
          <span v-if="userRole" class="badge" :class="userRole === 'adimim' ? 'ativo' : 'desligado'">
            {{ userRole.toUpperCase() }}
          </span>
        </div>
    <button @click="toggleTheme" class="btn-white">
        <span v-if="theme === 'light'">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M12 2a7 7 0 0 0-7 7c0 2.32 1.27 4.35 3.16 5.41a2 2 0 0 0 .84 1.59L9 18h6l0-1a2 2 0 0 0 .84-1.59A7 7 0 0 0 12 2z"></path>
            </svg>
            Modo Escuro
        </span>
        <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="yellow" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M12 2a7 7 0 0 0-7 7c0 2.32 1.27 4.35 3.16 5.41a2 2 0 0 0 .84 1.59L9 18h6l0-1a2 2 0 0 0 .84-1.59A7 7 0 0 0 12 2z"></path>
                <line x1="12" y1="2" x2="12" y2="2"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            </svg>
            Modo Claro
        </span>
    </button>
        <button class="btn-outline" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sair
        </button>
      </div>
    </header>

    <main class="main-content">
      <div class="page-header">
        <div>
          <h2 class="page-title">Gestão de Equipe</h2>
          <p class="page-subtitle">Controle de colaboradores e solicitações funcionais.</p>
        </div>
        <div class="action-bar">
          <button v-if="userRole === 'adimim'" class="btn-white" @click="abrirModalSolicitacoes">
            Solicitações ({{ solicitacoesPendentes.length }})
          </button>
          
          <button v-if="userRole === 'adimim'" class="btn-white" @click="exportarCSV">Exportar CSV</button>
          
          <button v-if="userRole === 'adimim'" class="btn-white" @click="abrirModalNovo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 5px; vertical-align: text-bottom;">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Novo Colaborador
          </button>
        </div>
      </div>

      <div class="card-grid filter-row">
        <div class="search-wrapper">
          <input type="text" v-model="filtroBusca" placeholder="Buscar por nome ou CPF..." class="input-search" />
        </div>
        <select v-model="filtroStatus" class="input-select">
          <option value="">Todos os Status</option>
          <option value="Ativo">Ativos</option>
          <option value="Desligado">Desligados</option>
        </select>
        <select v-model="filtroDepto" class="input-select">
          <option value="">Todos Departamentos</option>
          <option v-for="d in departamentosUnicos" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="isLoading" key="loading" class="card-grid">
          <table class="data-table">
            <thead>
              <tr>
                <th><div class="skeleton-item h-4 w-24"></div></th>
                <th><div class="skeleton-item h-4 w-32"></div></th>
                <th><div class="skeleton-item h-4 w-20"></div></th>
                <th><div class="skeleton-item h-4 w-16"></div></th>
                <th class="align-right"><div class="skeleton-item h-4 w-12 ml-auto"></div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td><div class="skeleton-item h-5 w-48 rounded"></div></td>
                <td><div class="skeleton-item h-5 w-32 rounded"></div></td>
                <td><div class="skeleton-item h-5 w-24 rounded"></div></td>
                <td><div class="skeleton-item h-6 w-20 rounded-full"></div></td>
                <td class="align-right">
                  <div class="action-buttons">
                    <div class="skeleton-item h-8 w-8 rounded"></div>
                    <div class="skeleton-item h-8 w-8 rounded"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else key="content" class="card-grid">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Status</th>
                <th class="align-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="colab in colaboradoresFiltrados" :key="colab.id">
                <td>{{ colab.nome_completo }}</td>
                <td>{{ colab.cargo }}</td>
                <td>{{ colab.departamento }}</td>
                <td>
                  <span :class="['badge', colab.status?.toLowerCase()]">{{ colab.status }}</span>
                </td>
                <td class="align-right">
                  <div class="action-buttons">
                    <button class="btn-icon" title="Editar" @click="abrirModalEditar(colab)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon" title="Linha do Tempo" @click="abrirModalTimeline(colab)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </button>
                    <button class="btn-icon" title="Imprimir Dossiê" @click="imprimirDossie(colab)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                    </button>
                    <button title="Desligar Colaborador" v-if="userRole === 'adimim' && colab.status === 'Ativo'" class="btn-icon danger" @click="executarComVerificacao(() => desligarColaborador(colab))">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
            <div class="pagination-container">
      <span class="pagination-info">
        Página {{ paginaAtual }} de {{ totalPaginas }}
      </span>
      <div class="pagination-buttons">
        <button 
          class="btn-pagination" 
          :disabled="paginaAtual === 1" 
          @click="mudarPagina(paginaAtual - 1)"
        >
          Anterior
        </button>
        <button 
          class="btn-pagination" 
          :disabled="paginaAtual >= totalPaginas" 
          @click="mudarPagina(paginaAtual + 1)"
        >
          Próxima
        </button>
      </div>
      </div>
          <!-- Empty State suave -->
          <div v-if="colaboradoresFiltrados.length === 0" class="empty-state-simple">
            Nenhum colaborador encontrado.
          </div>
        </div>
      </Transition>

    </main>

    <div v-if="isModalOpen" class="modal-backdrop" @click.self="fecharModal">
      <div class="modal-card">
        <header class="modal-header">
          <h3>{{ isEditando ? 'Ficha do Colaborador' : 'Novo Colaborador' }}</h3>
          <button class="btn-close" @click="fecharModal">✕</button>
        </header>

        <div class="form-body">
          <form @submit.prevent="handleSalvarColaborador">
            <div class="form-grid">
              <div class="input-field col-span-2">
                <label>Nome Completo <span style="color: red">*</span></label>
                <input type="text" v-model="colabEmEdicao.nome_completo" placeholder="Ex: Ana Beatriz Silva" :class="{ error: erros.nome_completo }" required />
              </div>

              <div class="input-field">
                <label>CPF <span style="color: red">*</span></label>
                <input type="text" v-model="colabEmEdicao.cpf" @input="aplicarMascaraCPF" maxlength="14" placeholder="000.000.000-00" :class="{ error: erros.cpf }" required />
              </div>

              <div class="input-field">
                <label>E-mail Corporativo</label>
                <input type="email" v-model="colabEmEdicao.email" placeholder="exemplo@empresa.com.br" :class="{ error: erros.email }" />
              </div>

              <div class="input-field">
                <label>Cargo Atual <span style="color: red">*</span></label>
                <input type="text" v-model="colabEmEdicao.cargo" placeholder="Ex: Gerente de Vendas" :class="{ error: erros.cargo }" required />
              </div>

              <div class="input-field">
                <label>Telefone <span style="color: red">*</span></label>
                <input type="text" v-model="colabEmEdicao.telefone" @input="aplicarMascaraTelefone" maxlength="15" placeholder="(00) 00000-0000" :class="{ error: erros.telefone }" required />
              </div>

              <div class="input-field col-span-2">
                <label>Endereço Completo <span style="color: red">*</span></label>
                <input type="text" v-model="colabEmEdicao.endereco" placeholder="Rua, número, bairro, cidade - UF" :class="{ error: erros.endereco }" required />
              </div>

              <div class="input-field">
                <label>Departamento <span style="color: red">*</span></label>
                <input type="text" v-model="colabEmEdicao.departamento" placeholder="Ex: Financeiro" :class="{ error: erros.departamento }" required />
              </div>

              <div class="input-field">
                <label>Salário Base (R$)</label>
                <input type="number" step="0.01" v-model.number="colabEmEdicao.salario" placeholder="0,00" :class="{ error: erros.salario }" />
              </div>

              <div class="input-field">
                <label>Data de Admissão <span style="color: red">*</span></label>
                <input type="date" v-model="colabEmEdicao.data_admissao" :class="{ error: erros.data_admissao }" required />
              </div>

              <div class="input-field">
                <label>Data de Nascimento <span style="color: red">*</span></label>
                <input type="date" v-model="colabEmEdicao.data_nascimento" :class="{ error: erros.data_nascimento }" required />
              </div>

              <div v-if="isEditando" class="col-span-2 cofre-section">
                <div class="section-header">
                  <h4 class="section-title">Cofre de Documentos</h4>
                  <p class="section-subtitle">Anexe contratos, atestados e documentos.</p>
                </div> 
              <div class="file-upload-wrapper">
                <label for="file-upload" class="file-upload-dropzone" :class="{ 'has-file': filePreview }">
                  <input id="file-upload" type="file" @change="prepararUpload" accept=".pdf,.jpg,.jpeg,.png" ref="fileInput" class="hidden-input" />
                  
                  <div v-if="!filePreview" class="dropzone-content">
                    <p class="upload-text">Clique para selecionar um arquivo</p>
                  </div>
                  
                  <div v-else class="file-preview">
                    <div v-if="filePreviewType.startsWith('image/')" class="image-preview">
                      <img :src="filePreview" alt="Preview" style="max-height: 120px; max-width: 100%; object-fit: contain; border-radius: 6px;" />
                    </div>
                    <div v-else class="document-preview">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <line x1="10" y1="9" x2="8" y2="9" />
                      </svg>
                      <span>{{ fileToUpload?.name }}</span>
                    </div>
                  </div>
                  <div v-if="filePreview" class="file-actions" style="display: flex; gap: 10px; margin-top: 15px; justify-content: center;">
                    
                    <button type="button" class="btn-icon danger" @click="limparPreview" title="Remover Arquivo">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                    </button>
                
                    <button v-if="userRole === 'adimim'" type="button" class="btn-white success" @click="uploadDocumentoCofre" :disabled="uploading">
                      {{ uploading ? 'Enviando...' : 'Confirmar Envio' }}
                    </button>
                  </div>
                </label> 
              </div>
                <div v-if="documentosColab.length > 0" class="doc-list">
                  <div v-for="doc in documentosColab" :key="doc.id" class="doc-item">
                    <span>{{ doc.descricao }}</span>
                    <button type="button" @click="visualizarDocumento(doc.arquivo_url)" class="btn-white">Abrir</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="isEditando && userRole !== 'adimim'" class="footer-note warning">
               Nota: Como não é Administrador, esta alteração será enviada para aprovação.
            </div>

            <footer class="modal-footer">
              <button type="button" class="btn-white" @click="fecharModal">Cancelar</button>
              <button type="submit" class="btn-white">
                {{ userRole === 'adimim' || !isEditando ? 'Salvar Agora' : 'Enviar Solicitação' }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </div>

    <div v-if="isModalLinhaTempoOpen" class="modal-backdrop" @click.self="fecharModalTimeline">
      <div class="modal-card">
        <header class="modal-header">
          <h3>Histórico: {{ colabSelecionado?.nome_completo }}</h3>
          <button class="btn-close" @click="fecharModalTimeline">✕</button>
        </header>
        
        <div class="timeline-filters">
          <input type="text" v-model="filtroTimelineBusca" placeholder="Procurar no histórico..." class="input-search-sm" />
          <select v-model="filtroTimelineTipo" class="input-select-sm">
            <option value="">Todos os Eventos</option>
            <option value="Admissão">Admissão</option>
            <option value="Desligamento">Desligamento</option>
            <option value="Upload de Documento">Documentos</option>
          </select>
        </div>

        <div class="form-body timeline-wrapper">
          <div v-for="evento in timelineFiltrada" :key="evento.id" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <strong>{{ evento.tipo_evento }}</strong> - <small>{{ formatarData(evento.data_evento) }}</small>
              <p>{{ evento.descricao }}</p>
              <button v-if="evento.arquivo_url" @click="visualizarDocumento(evento.arquivo_url)" class="btn-white">
                Ver Anexo
              </button>
            </div>
          </div>
          <div v-if="timelineFiltrada.length === 0" class="empty-state">Nenhum evento encontrado.</div>
        </div>
      </div>
    </div>

    <div v-if="isModalSolicitacoesOpen" class="modal-backdrop" @click.self="isModalSolicitacoesOpen = false">
      <div class="modal-card" style="max-width: 600px">
        <header class="modal-header">
          <h3>Solicitações Pendentes</h3>
          <button class="btn-close" @click="isModalSolicitacoesOpen = false">✕</button>
        </header>
        <div class="form-body">
          <div v-for="sol in solicitacoesPendentes" :key="sol.id" class="solicitacao-item">
            <div class="sol-details">
              <strong>Solicitante: {{ sol.solicitante_email }}</strong>
              <p>Alteração para: {{ sol.dados_novos.nome_completo }}</p>
            </div>
            <div class="sol-actions">
              <button class="btn-icon danger" @click="rejeitarSolicitacao(sol.id)">✕</button>
              <button class="btn-icon success" @click="aprovarSolicitacao(sol)">✓</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalSenhaOpen" class="modal-backdrop">
      <div class="modal-card" style="max-width: 400px">
        <header class="modal-header"><h3>Confirmação de Segurança</h3></header>
        <div class="form-body">
          <p>Reintroduza a sua senha para confirmar.</p>
          <input type="password" v-model="senhaConfirmacao" class="input-search" placeholder="Senha" />
          <footer class="modal-footer">
            <button class="btn-white" @click="isModalSenhaOpen = false">Cancelar</button>
            <button class="btn-white" @click="confirmarSenhaSupabase">Confirmar</button>
          </footer>
        </div>
      </div>
    </div>
  </div>

  <transition name="toast">
    <div v-if="feedback.mensagem" :class="['toast-message', feedback.tipo]"><span>{{ feedback.mensagem }}</span></div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useTheme } from '../composables/useDarkMode'

const { theme, toggleTheme } = useTheme()
const router = useRouter()
const userRole = ref<string>('user')
const usuarioAtual = ref<any>(null)
const colaboradores = ref<any[]>([])
const solicitacoesPendentes = ref<any[]>([])
const isLoading = ref(true) // Começa como true para mostrar o loading ao entrar
const totalColaboradores = ref(0)
const paginaAtual = ref(1)
const itensPorPagina = 10 // Defina a quantidade desejada

const timelineColab = ref<any[]>([])
const documentosColab = ref<any[]>([])
const isModalOpen = ref(false)
const isModalLinhaTempoOpen = ref(false)
const isModalSolicitacoesOpen = ref(false)
const isEditando = ref(false)
const colabEmEdicao = ref<any>({})
const colabSelecionado = ref<any>(null)
const erros = ref<Record<string, string>>({})
const feedback = ref({ mensagem: '', tipo: '' })

// Filtros
const filtroBusca = ref('')
const filtroStatus = ref('')
const filtroDepto = ref('')
const filtroTimelineBusca = ref('')
const filtroTimelineTipo = ref('')

// Segurança
const contadorAcoes = ref(0)
const limiteAcoes = 3
const isModalSenhaOpen = ref(false)
const senhaConfirmacao = ref('')
const acaoPendente = ref<Function | null>(null)
const uploading = ref(false)

// Variáveis de arquivo
const fileToUpload = ref<File | null>(null)
const filePreview = ref<string | null>(null)
const filePreviewType = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)

// --- COMPUTED PROPERTIES ---
const departamentosUnicos = computed(() => [...new Set(colaboradores.value.map(c => c.departamento))])

const colaboradoresFiltrados = computed(() => {
  return colaboradores.value.filter(c => {
    const s = filtroBusca.value.toLowerCase()
    return (c.nome_completo.toLowerCase().includes(s) || c.cpf.includes(s)) &&
           (filtroStatus.value ? c.status === filtroStatus.value : true) &&
           (filtroDepto.value ? c.departamento === filtroDepto.value : true)
  })
})

const timelineFiltrada = computed(() => {
  return timelineColab.value.filter(e => {
    const search = filtroTimelineBusca.value.toLowerCase()
    const matchesBusca = e.descricao.toLowerCase().includes(search)
    const matchesTipo = filtroTimelineTipo.value ? e.tipo_evento === filtroTimelineTipo.value : true
    return matchesBusca && matchesTipo
  })
})

// --- INICIALIZAÇÃO ---
onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) { router.push('/'); return }
  
  usuarioAtual.value = session.user
  const { data: perfil } = await supabase.from('perfis').select('role').eq('id', session.user.id).single()
  userRole.value = perfil?.role || 'user'
  
  await fetchColaboradores()
  if (userRole.value === 'adimim') fetchSolicitacoes()
})

// --- MÉTODOS DE BUSCA ---
const fetchColaboradores = async () => {
  try {
    isLoading.value = true // Ativa skeleton
    const de = (paginaAtual.value - 1) * itensPorPagina
    const ate = de + itensPorPagina - 1

     const { data, error, count } = await supabase
      .from('colaboradores')
      .select('*', { count: 'exact' })
      .range(de, ate)
      .order('nome_completo', { ascending: true })

    if (error) throw error

    colaboradores.value = data || []
    totalColaboradores.value = count || 0
  } catch (error) {
    console.error(error)
  } finally {
    // Pequeno timeout opcional para evitar o "flash" se a internet for rápida demais
    setTimeout(() => { isLoading.value = false }, 400)
  }
}

const totalPaginas = computed(() => Math.ceil(totalColaboradores.value / itensPorPagina))
// Navegação de página
const mudarPagina = (novaPagina: number) => {
  if (novaPagina >= 1 && novaPagina <= totalPaginas.value) {
    paginaAtual.value = novaPagina
    fetchColaboradores() // Chama o Supabase com o novo range
  }
}

onMounted(() => {
  fetchColaboradores()
})

const fetchSolicitacoes = async () => {
  const { data, error } = await supabase
    .from('solicitacoes')
    .select('*')
    .eq('status', 'Pendente');

  if (error) {
    console.error("Erro na busca de solicitações:", error.message);
    return;
  }

  console.log("Solicitações carregadas:", data); // Verifique se o array vem preenchido no console (F12)
  solicitacoesPendentes.value = data || [];
};

const carregarDocumentos = async (id: string) => {
  const { data } = await supabase.from('linha_do_tempo').select('*').eq('colaborador_id', id).eq('tipo_evento', 'Upload de Documento').order('data_evento', { ascending: false })
  documentosColab.value = data || []
}

// --- LOGICA DE SALVAR / SOLICITAR ---
const handleSalvarColaborador = async () => {
  // 1. Limpa erros e valida campos obrigatórios
  erros.value = {}
  if (!colabEmEdicao.value.nome_completo) erros.value.nome_completo = 'Obrigatório'
  if (!colabEmEdicao.value.cpf) erros.value.cpf = 'Obrigatório'
  
  if (Object.keys(erros.value).length > 0) {
    return mostrarFeedback('Verifique os campos obrigatórios.', 'erro')
  }

  // 2. Decide se salva direto (ADM ou Novo) ou se cria Solicitação (User editando)
  if (userRole.value === 'adimim' || !isEditando.value) {
    await executarComVerificacao(salvarDireto)
  } else {
    await enviarSolicitacao()
  }
}

const enviarSolicitacao = async () => {
  try {
    // Criamos uma cópia limpa apenas com os dados de texto/número
    const dadosParaEnvio = JSON.parse(JSON.stringify(colabEmEdicao.value));

    const novaSolicitacao = {
      colaborador_id: colabEmEdicao.value.id,
      solicitante_id: usuarioAtual.value.id,
      solicitante_email: usuarioAtual.value.email,
      dados_novos: dadosParaEnvio, // Dados limpos
      status: 'Pendente'
    }

    const { error } = await supabase
      .from('solicitacoes')
      .insert([novaSolicitacao])

    if (error) throw error

    mostrarFeedback('Solicitação enviada para aprovação!', 'sucesso')
    fecharModal()
    
  } catch (err) {
    console.error('Erro detalhado:', err) // VEJA O ERRO NO CONSOLE (F12)
    mostrarFeedback('Erro ao processar solicitação.', 'erro')
  }
}

const salvarDireto = async () => {
  const c = colabEmEdicao.value
  c.salario = parseFloat(Number(c.salario || 0).toFixed(2))

  if (isEditando.value) {
    const { id, created_at, ...dados } = c
    await supabase.from('colaboradores').update(dados).eq('id', id)
    mostrarFeedback('Atualizado com sucesso!', 'sucesso')
  } else {
    const { data } = await supabase.from('colaboradores').insert([c]).select()
    if (data) {
      await supabase.from('linha_do_tempo').insert([{
        colaborador_id: data[0].id,
        tipo_evento: 'Admissão',
        descricao: `Admitido no cargo ${data[0].cargo}`,
        data_evento: data[0].data_admissao,
      }])
    }
    mostrarFeedback('Cadastrado com sucesso!', 'sucesso')
  }
  fecharModal(); fetchColaboradores()
}

// --- AÇÕES DO ADM ---
const aprovarSolicitacao = async (sol: any) => {
  try {
    console.log('Tentando aprovar solicitação ID:', sol.id);
    console.log('Colaborador alvo ID:', sol.colaborador_id);

    // 1. Remove campos protegidos para evitar erro de escrita no PostgreSQL
    const { id, created_at, updated_at, ...dadosParaAtualizar } = sol.dados_novos;

    // 2. Atualiza os dados do COLABORADOR
    const { error: errorColab } = await supabase
      .from('colaboradores')
      .update(dadosParaAtualizar)
      .eq('id', sol.colaborador_id);

    if (errorColab) throw errorColab;

    // 3. Atualiza o status da SOLICITAÇÃO e pede o retorno (.select)
    const { data: solAtualizada, error: errorSol } = await supabase
      .from('solicitacoes')
      .update({ status: 'Aprovada' })
      .eq('id', sol.id)
      .select();

    if (errorSol) throw errorSol;

    // 4. Verificação de segurança: Se o array voltar vazio, o RLS bloqueou silenciosamente
    if (!solAtualizada || solAtualizada.length === 0) {
      throw new Error('RLS (Políticas) bloqueou o UPDATE na tabela solicitacoes. A linha existe, mas você não tem permissão para editá-la.');
    }

    mostrarFeedback('Solicitação aprovada com sucesso!', 'sucesso');
    
    // 5. ATUALIZAÇÃO DA UI
    await fetchSolicitacoes(); 
    await fetchColaboradores();
    
  } catch (err) {
    console.error('Erro detalhado na aprovação:', err);
    mostrarFeedback('Erro ao gravar no banco. Verifique o console.', 'erro');
  }
};


const rejeitarSolicitacao = async (id: string) => {
  try {
    console.log('Tentando rejeitar solicitação ID:', id);

    // Atualiza e já pede o retorno dos dados afetados
    const { data: solRejeitada, error } = await supabase
      .from('solicitacoes')
      .update({ status: 'Rejeitada' })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Se o banco não devolver a linha alterada, falhou silenciosamente pelo RLS
    if (!solRejeitada || solRejeitada.length === 0) {
       throw new Error('RLS (Políticas) bloqueou a rejeição na tabela solicitacoes.');
    }

    mostrarFeedback('Solicitação rejeitada.', 'sucesso');
    await fetchSolicitacoes(); 

  } catch (err) {
    console.error('Erro ao rejeitar:', err);
    mostrarFeedback('Falha ao atualizar solicitação. Verifique o console.', 'erro');
  }
};

const desligarColaborador = async (colab: any) => {
  const motivo = prompt('Motivo do desligamento:')
  if (!motivo) return
  await supabase.from('colaboradores').update({ status: 'Desligado' }).eq('id', colab.id)
  await supabase.from('linha_do_tempo').insert([{
    colaborador_id: colab.id,
    tipo_evento: 'Desligamento',
    descricao: motivo,
    data_evento: new Date().toISOString()
  }])
  fetchColaboradores()
}

// --- UTILITÁRIOS / MODAIS ---
const abrirModalSolicitacoes = () => { fetchSolicitacoes(); isModalSolicitacoesOpen.value = true }
const abrirModalNovo = () => { isEditando.value = false; colabEmEdicao.value = { status: 'Ativo' }; isModalOpen.value = true }

const abrirModalEditar = async (colab: any) => {
  isEditando.value = true
  const { data } = await supabase.from('colaboradores').select('*').eq('id', colab.id).single()
  colabEmEdicao.value = { ...data }
  await carregarDocumentos(colab.id)
  isModalOpen.value = true
}

const fecharModal = () => { isModalOpen.value = false; colabEmEdicao.value = {}; limparPreview() }

const abrirModalTimeline = async (colab: any) => {
  colabSelecionado.value = colab
  const { data } = await supabase.from('linha_do_tempo').select('*').eq('colaborador_id', colab.id).order('data_evento', { ascending: false })
  timelineColab.value = data || []
  isModalLinhaTempoOpen.value = true
}

const fecharModalTimeline = () => { isModalLinhaTempoOpen.value = false; filtroTimelineBusca.value = ''; filtroTimelineTipo.value = '' }

const executarComVerificacao = (acao: Function) => {
  if (contadorAcoes.value >= limiteAcoes) { acaoPendente.value = acao; isModalSenhaOpen.value = true }
  else { contadorAcoes.value++; acao() }
}

const confirmarSenhaSupabase = async () => {
  const { error } = await supabase.auth.signInWithPassword({ email: usuarioAtual.value.email, password: senhaConfirmacao.value })
  if (!error) { contadorAcoes.value = 0; isModalSenhaOpen.value = false; senhaConfirmacao.value = ''; acaoPendente.value?.() }
  else mostrarFeedback('Senha incorreta!', 'erro')
}

const handleLogout = async () => { await supabase.auth.signOut(); router.push('/') }
const formatarData = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'
const mostrarFeedback = (m: string, t: string) => { feedback.value = { mensagem: m, tipo: t }; setTimeout(() => feedback.value = { mensagem: '', tipo: '' }, 3000) }

// MÁSCARAS E ARQUIVOS
const aplicarMascaraCPF = (e: any) => {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  colabEmEdicao.value.cpf = v
}

const aplicarMascaraTelefone = (e: any) => {
  let v = e.target.value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2')
  else v = v.replace(/^(\d*)/, '($1')
  colabEmEdicao.value.telefone = v
}

const prepararUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  fileToUpload.value = file
  filePreviewType.value = file.type
  if (file.type.startsWith('image/')) {
    const reader = new FileReader(); reader.onload = (e) => { filePreview.value = e.target?.result as string }; reader.readAsDataURL(file)
  } else filePreview.value = 'document'
}

const limparPreview = () => { fileToUpload.value = null; filePreview.value = null; if (fileInput.value) fileInput.value.value = '' }

const uploadDocumentoCofre = async () => {
  if (!fileToUpload.value || !colabEmEdicao.value.id) return
  uploading.value = true
  const filePath = `cofre/${colabEmEdicao.value.id}/${Date.now()}_${fileToUpload.value.name}`
  const { error } = await supabase.storage.from('documentos_colaboradores').upload(filePath, fileToUpload.value)
  if (!error) {
    await supabase.from('linha_do_tempo').insert([{ colaborador_id: colabEmEdicao.value.id, tipo_evento: 'Upload de Documento', descricao: `Documento: ${fileToUpload.value.name}`, arquivo_url: filePath, data_evento: new Date().toISOString() }])
    limparPreview(); carregarDocumentos(colabEmEdicao.value.id)
    mostrarFeedback('Arquivo enviado!', 'sucesso')
  }
  uploading.value = false
}

const visualizarDocumento = async (path: string) => {
  const { data } = await supabase.storage.from('documentos_colaboradores').createSignedUrl(path, 60)
  if (data?.signedUrl) window.open(data.signedUrl, '_blank')
}

// EXPORTAÇÃO
const exportarCSV = () => {
  const SEPARADOR = ';'
  const cabecalho = ['Nome', 'CPF', 'Email', 'Cargo', 'Depto', 'Status', 'Admissao']
  const linhas = colaboradoresFiltrados.value.map((c) =>
    [c.nome_completo, c.cpf, c.email, c.cargo, c.departamento, c.status, c.data_admissao]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(SEPARADOR)
  )
  const csv = '\ufeff' + [cabecalho.join(SEPARADOR), ...linhas].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'colaboradores_mj.csv'; link.click()
}

const imprimirDossie = (c: any) => {
  const win = window.open('', '_blank')

  const formatarDataSegura = (data: string) => {
    try {
      return typeof formatarData === 'function' ? formatarData(data) : data
    } catch (e) {
      return data
    }
  }

  win?.document.write(`
    <html>
    <head>
      <title>Dossiê - ${c.nome_completo}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #333; margin: 0; }
        .header { display: flex; justify-content: space-between; border: 1px solid #000; padding: 15px; margin-bottom: 20px; }
        .header-left { width: 25%; font-weight: bold; font-size: 14px; }
        .header-center { width: 50%; line-height: 1.4; }
        .header-center h2 { margin: 0 0 5px 0; font-size: 16px; text-transform: uppercase; }
        .header-center p { margin: 0; font-size: 11px; }
        .header-right { width: 25%; text-align: right; line-height: 1.4; }
        .header-right h3 { margin: 0 0 5px 0; font-size: 16px; }
        .section-title { background-color: #f4f4f4; border: 1px solid #ccc; font-weight: bold; text-align: center; padding: 6px; margin: 20px 0 10px 0; font-size: 12px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f9f9f9; font-weight: bold; width: 25%; }
        td { width: 75%; color: #000; }
        .footer { display: flex; justify-content: space-around; align-items: flex-end; margin-top: 80px; }
        .signature { width: 300px; border-top: 1px solid #000; text-align: center; padding-top: 5px; font-size: 11px; }
        .watermark { font-size: 10px; color: #999; text-align: right; margin-top: 60px; border-top: 1px solid #eee; padding-top: 10px; }
        @media print { body { padding: 0; } @page { margin: 15mm; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-center">
          <h2>CONFECCOES MJ</h2>
          <p>CNPJ: 53.756.096/0001-89</p>
          <p>RUA LUIZ MONTANHAN, 1302 (BARRACÃO TERRA NOVA)</p>
          <p>Tietê/SP - CEP: 18530-000</p>
          <p>(15) 9789-0653 - (15) 99763-7941</p>
          <p>mrjackyfinanceiro@gmail.com</p>
        </div>
        <div class="header-right">
          <h3>DOSSIÊ DO COLABORADOR</h3>
        </div>
      </div>
      <div class="section-title">DADOS PESSOAIS</div>
      <table>
        <tbody>
          <tr><th>Nome Completo:</th><td>${c.nome_completo || ''}</td></tr>
          <tr><th>CPF:</th><td>${c.cpf || ''}</td></tr>
          <tr><th>Data de Nascimento:</th><td>${c.data_nascimento || ''}</td></tr>
          <tr><th>Telefone:</th><td>${c.telefone || ''}</td></tr>
          <tr><th>Endereço:</th><td>${c.endereco || ''}</td></tr>
        </tbody>
        
      </table>
      <div class="section-title">DADOS PROFISSIONAIS</div>
      <table>
        <tbody>
          <tr><th>Cargo:</th><td>${c.cargo || ''}</td></tr>
          <tr><th>Departamento:</th><td>${c.departamento || ''}</td></tr>
          <tr><th>Admissão:</th><td>${c.data_admissao ? formatarDataSegura(c.data_admissao) : ''}</td></tr>
          <tr><th>Status:</th><td>${c.status || ''}</td></tr>
        </tbody>
      </table>
      <div class="footer">
        <div class="signature">Assinatura do Colaborador</div>
      </div>
      <div class="watermark">Gerado com MJProcess</div>
      <script>
        window.onload = function() { window.print(); };
        window.onafterprint = function() { window.close(); };
      <\/script>
    </body>
    </html>
  `)

  win?.document.close()
}
</script>

<style scoped>
@import '../assets/homecss.css';

.theme-btn {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.2s;
}
.card-grid {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: background-color 0.3s, border-color 0.3s;
}

/* Linha de Filtros */
.filter-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

/* Inputs e Selects */
.input-search, 
.input-select {
  background-color: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 10px 15px;
  border-radius: 6px;
  outline: none;
  transition: all 0.2s;
}

.input-search:focus, 
.input-select:focus {
  border-color: var(--accent);
}

/* Tabela */
.data-table {
  width: 100%;
  border-collapse: collapse;
  color: var(--text-primary);
}

.data-table th {
  text-align: left;
  padding: 12px;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-secondary);
  font-weight: 600;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.data-table tbody tr:hover {
  background-color: var(--table-hover);
}

/* Botões de Ação */
.btn-icon {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-icon svg {
  width: 18px;
  height: 18px;
}

.btn-icon:hover {
  background-color: var(--bg-input);
  color: var(--accent);
}

.btn-icon.danger:hover {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

/* Alinhamentos */
.align-right {
  text-align: right;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* Transição de Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* SKELETON ANIMATION */
.skeleton-item {
  background-color: #e2e8f0; /* Cor Light */
  position: relative;
  overflow: hidden;
  border-radius: 15px;
}

/* Efeito Shimmer (Brilho movendo) */
.skeleton-item::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

/* Suporte ao Dark Mode no Skeleton */
:global(.dark) .skeleton-item {
  background-color: #2d3748;
}
:global(.dark) .skeleton-item::after {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
}

/* Utilitários de Skeleton */
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
.w-12 { width: 3rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-24 { width: 6rem; }
.w-32 { width: 8rem; }
.w-48 { width: 12rem; }
.rounded { border-radius: 4px; }
.rounded-full { border-radius: 9999px; }
.ml-auto { margin-left: auto; }

/* Empty State */
.empty-state-simple {
  padding: 40px;
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
}

/* Ajuste na tabela para não quebrar com skeleton */
.data-table {
  width: 100%;
  border-collapse: collapse;
}
</style>