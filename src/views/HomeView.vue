<template>
  <div class="app-container header">
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
            @change="fetchColaboradores"
          >
            <option disabled value="">Selecione uma empresa</option>
            <option v-for="empresa in empresas" :key="empresa.id" :value="empresa.id">
              {{ empresa.nome }}
            </option>
          </select>
        </div>
      </div>

      <div class="navbar-right">
        
        <template v-if="userRole === 'adimim' && !isLoading">
          <select class="input-select" style="min-width: 180px; border-color: var(--primary);" @change="lidarComAcoesRapidas($event)">
            <option value="" disabled selected>⚙️ Ações Rápidas...</option>
            <option value="novo_usuario">👤 Novo Usuário (Acesso)</option>
            <option value="novo_setor">🏢 Cadastrar Novo Setor</option>
          </select>
        </template>

        <div class="nav-divider"></div>
        
        <template v-if="isLoading">
          <div class="skeleton-item rounded" style="width: 140px; height: 20px;"></div>
          <div class="skeleton-item rounded-full" style="width: 60px; height: 24px;"></div>
        </template>
        <template v-else>
          <div class="user-info" style="display: flex; flex-direction: column; align-items: flex-end; line-height: 1.2;">
            <span v-if="userRole" class="badge" :class="userRole === 'adimim' ? 'ativo' : 'user'" style="font-size: 0.7rem; margin-top: 2px;">
              {{ userRole.toUpperCase() }}
            </span>
            <span class="user-email" style="font-size: 0.9rem; font-weight: 500;">{{ usuarioAtual?.email || 'Carregando...' }}</span>
          </div>
        </template>
        
        <button @click="toggleTheme" class="btn-white btn-icon" :title="theme === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'">
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

        <button class="btn-outline danger" @click="handleLogout" title="Encerrar Sessão">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 5px; vertical-align: middle;">
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
          <template v-if="isLoading">
            <div class="skeleton-item rounded" style="width: 140px; height: 36px;"></div>
            <div class="skeleton-item rounded" style="width: 110px; height: 36px;"></div>
            <div class="skeleton-item rounded" style="width: 160px; height: 36px;"></div>
          </template>
          
          <template v-else>
            <span class="badge warning" style="margin-right: 10px;" v-if="solicitacoesPendentes.length >= 1">Pendentes: {{ solicitacoesPendentes.length }}</span>
            <button v-if="userRole === 'adimim'" class="btn-white" @click="abrirModalSolicitacoes">
              Solicitações ({{ solicitacoesPendentes.length }})
            </button>
            
            <select class="ExportacaoSelect" @change="lidarComExportacao($event)">
              <option value="" disabled selected>Opções de Exportação...</option>
              <option value="csv" class="ExportarCSV">Exportar como CSV</option>
              <option value="pdf" class="ExportarPDF">Exportar como PDF</option>
            </select>
            
            <button v-if="userRole === 'adimim'" class="btn-white" @click="abrirModalNovo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; margin-right: 5px; vertical-align: text-bottom;">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Novo Colaborador
            </button>
          </template>
        </div>
      </div>

      <div class="card-grid">
        <template v-if="isLoading">
          <div class="search-wrapper" style="flex: 1;">
            <div class="skeleton-item" style="width: 100%; height: 42px;"></div>
          </div>
          <div class="skeleton-item" style="width: 100%; height: 42px;"></div>
          <div class="skeleton-item" style="width: 100%; height: 42px;"></div>
        </template>
        
        <template v-else>
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
        </template>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="isLoading" key="loading" class="card-grid">
          <table class="data-table">
            <thead>
              <tr>
                <th><div class="skeleton-item rounded" style="width: 120px; height: 16px;"></div></th>
                <th><div class="skeleton-item rounded" style="width: 100px; height: 16px;"></div></th>
                <th><div class="skeleton-item rounded" style="width: 110px; height: 16px;"></div></th>
                <th><div class="skeleton-item rounded" style="width: 60px; height: 16px;"></div></th>
                <th class="align-right"><div class="skeleton-item rounded ml-auto" style="width: 80px; height: 16px;"></div></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 10" :key="i">
                <td><div class="skeleton-item rounded" style="width: 150px; height: 20px;"></div></td>
                <td><div class="skeleton-item rounded" style="width: 120px; height: 20px;"></div></td>
                <td><div class="skeleton-item rounded" style="width: 130px; height: 20px;"></div></td>
                <td><div class="skeleton-item rounded-full" style="width: 70px; height: 24px;"></div></td>
                <td class="align-right">
                  <div class="action-buttons">
                    <div class="skeleton-item rounded" style="width: 28px; height: 28px;"></div>
                    <div class="skeleton-item rounded" style="width: 28px; height: 28px;"></div>
                    <div class="skeleton-item rounded" style="width: 28px; height: 28px;"></div>
                    <div class="skeleton-item rounded" style="width: 28px; height: 28px;"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination-container" style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div class="skeleton-item rounded" style="width: 100px; height: 20px;"></div>
            <div style="display: flex; gap: 10px;">
              <div class="skeleton-item rounded" style="width: 85px; height: 35px;"></div>
              <div class="skeleton-item rounded" style="width: 85px; height: 35px;"></div>
            </div>
          </div>
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
                    <button class="btn-icon" data-tooltip="Editar" @click="abrirModalEditar(colab)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon" data-tooltip="Linha do Tempo" @click="abrirModalTimeline(colab)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </button>
                    <button class="btn-icon" data-tooltip="Imprimir Dossiê" @click="imprimirDossie(colab)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
                    </button>
                    <button v-if="userRole === 'adimim' && colab.status === 'Ativo'" data-tooltip="Desligar Colaborador" class="btn-icon danger" @click="executarComVerificacao(() => desligarColaborador(colab))">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="colaboradoresFiltrados.length === 0" class="empty-state-simple">
            Nenhum colaborador encontrado.
          </div>
          <div v-if="colaboradoresFiltrados.length > 0" class="pagination-container">
            <span class="pagination-info">
              Página {{ paginaAtual }} de {{ totalPaginas }}
            </span>
            <div class="pagination-buttons">
              <button type="button" class="btn-pagination" :disabled="paginaAtual === 1" @click.prevent="paginaAnterior">
                Anterior
              </button>
              <button type="button" class="btn-pagination" :disabled="paginaAtual >= totalPaginas" @click.prevent="proximaPagina">
                Próxima
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </main>

    <Transition name="fade">
      <div v-if="isModalNovoUsuarioOpen" class="modal-backdrop" @click.self="fecharModalNovoUsuario">
        <div class="modal-card small-modal">
          <header class="modal-header">
            <h3>👤 Criar Usuário de Acesso</h3>
            <button class="btn-close" @click="fecharModalNovoUsuario">✕</button>
          </header>
          <div class="form-body">
            <form @submit.prevent="cadastrarNovoUsuarioAuth">
              <div class="form-vertical">
                <div class="input-field">
                  <label>E-mail Corporativo</label>
                  <input type="email" v-model="novoUsuarioForm.email" :class="{ error: errosAuth.email }" required />
                  <p v-if="errosAuth.email" class="error-msg">{{ errosAuth.email }}</p>
                </div>
                <div class="input-field">
                  <label>Senha Provisória</label>
                  <input type="password" v-model="novoUsuarioForm.password" :class="{ error: errosAuth.password }" required />
                  <p v-if="errosAuth.password" class="error-msg">{{ errosAuth.password }}</p>
                </div>
                <div class="input-field">
                  <label>Nível de Acesso (Role)</label>
                  <select v-model="novoUsuarioForm.role" required>
                    <option value="user">Usuário Comum (Visualização)</option>
                    <option value="rh">Gestor RH (Edição)</option>
                    <option value="adimim">Administrador (Total)</option>
                  </select>
                </div>
              </div>
              <footer class="modal-footer">
                <button type="button" class="btn-white" @click="fecharModalNovoUsuario">Cancelar</button>
                <button type="submit" class="btn-white success" :disabled="isCadastrandoUsuario">
                  {{ isCadastrandoUsuario ? 'Processando...' : 'Confirmar Cadastro' }}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="isModalNovoSetorOpen" class="modal-backdrop" @click.self="fecharModalNovoSetor">
        <div class="modal-card small-modal">
          <header class="modal-header">
            <h3>🏢 Novo Setor / Empresa</h3>
            <button class="btn-close" @click="fecharModalNovoSetor">✕</button>
          </header>
          <div class="form-body">
            <div class="input-field">
              <label>Nome da Unidade</label>
              <input type="text" v-model="novoSetorNome" placeholder="Ex: Matriz Tietê" :class="{ error: erroSetor }" />
            </div>
            <footer class="modal-footer">
              <button type="button" class="btn-white" @click="fecharModalNovoSetor">Cancelar</button>
              <button type="button" class="btn-white success" @click="cadastrarNovoSetor" :disabled="isCadastrandoSetor">Salvar</button>
            </footer>
          </div>
        </div>
      </div>
    </Transition>

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
              <button class="btn-icon danger" @click="rejeitarSolicitacao(sol.id)" title="Rejeitar">✕</button>
              <button class="btn-icon success" @click="aprovarSolicitacao(sol)" title="Aprovar">✓</button>
            </div>
          </div>
          <div v-if="solicitacoesPendentes.length === 0" class="empty-state">Nenhuma solicitação pendente no momento.</div>
        </div>
      </div>
    </div>

    <div v-if="isModalSenhaOpen" class="modal-backdrop">
      <div class="modal-card" style="max-width: 400px">
        <header class="modal-header"><h3>Confirmação de Segurança</h3></header>
        <div class="form-body">
          <p>Reintroduza a sua senha para confirmar essa ação crítica.</p>
          <input type="password" v-model="senhaConfirmacao" class="input-search" placeholder="Sua senha atual" />
          <footer class="modal-footer" style="margin-top: 15px;">
            <button class="btn-white" @click="isModalSenhaOpen = false">Cancelar</button>
            <button class="btn-white danger" @click="confirmarSenhaSupabase">Confirmar Ação</button>
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
import { useTenantStore } from '@/stores/tenant'
import LoadingView from '../composables/LoadingView.vue';

const isFirstLoad = ref(true)
const isLoading = ref(false)
const isLoggingOut = ref(false)

const empresas = ref<{ id: string, nome: string }[]>([])
const tenantStore = useTenantStore()
const { theme, toggleTheme } = useTheme()
const router = useRouter()
const userRole = ref<string>('user')
const usuarioAtual = ref<any>(null)
const colaboradores = ref<any[]>([])
const solicitacoesPendentes = ref<any[]>([])
const totalColaboradores = ref(0)
const paginaAtual = ref(1)
const itensPorPagina = 10

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

const filtroBusca = ref('')
const filtroStatus = ref('')
const filtroDepto = ref('')
const filtroTimelineBusca = ref('')
const filtroTimelineTipo = ref('')

const contadorAcoes = ref(0)
const limiteAcoes = 3
const isModalSenhaOpen = ref(false)
const senhaConfirmacao = ref('')
const acaoPendente = ref<Function | null>(null)
const uploading = ref(false)

const fileToUpload = ref<File | null>(null)
const filePreview = ref<string | null>(null)
const filePreviewType = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)

const isModalNovoUsuarioOpen = ref(false)
const isCadastrandoUsuario = ref(false)

const novoUsuarioForm = ref({ 
  email: '', 
  password: '', 
  confirmPassword: '', 
  role: 'user' 
})

const errosAuth = ref({ 
  email: '', 
  password: '', 
  confirmPassword: '' 
})

const isModalNovoSetorOpen = ref(false)
const isCadastrandoSetor = ref(false)
const novoSetorNome = ref('')
const erroSetor = ref('')
  
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

const totalPaginas = computed(() => Math.ceil(totalColaboradores.value / itensPorPagina))

// --- FUNÇÕES DE AÇÕES RÁPIDAS DO ADMIN ---
const lidarComAcoesRapidas = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const acao = select.value

  if (acao === 'novo_usuario') {
    abrirModalNovoUsuarioAuth()
  } else if (acao === 'novo_setor') {
    abrirModalNovoSetor()
  }

  // Reseta o select para o estado inicial para permitir novos cliques na mesma opção depois
  select.value = ''
}

// Lógica Novo Usuário (Supabase Auth)
const abrirModalNovoUsuarioAuth = () => {
  novoUsuarioForm.value = { email: '', password: '', confirmPassword: '', role: 'user' }
  errosAuth.value = { email: '', password: '', confirmPassword: '' }
  isModalNovoUsuarioOpen.value = true
}

const fecharModalNovoUsuario = () => {
  isModalNovoUsuarioOpen.value = false
}

const cadastrarNovoUsuarioAuth = async () => {
  // Limpa erros anteriores
  errosAuth.value = { email: '', password: '', confirmPassword: '' }

  // Validações básicas de UX
  if (!novoUsuarioForm.value.email.includes('@')) return errosAuth.value.email = "E-mail inválido"
  if (novoUsuarioForm.value.password.length < 6) return errosAuth.value.password = "Mínimo 6 caracteres"
  if (novoUsuarioForm.value.password !== novoUsuarioForm.value.confirmPassword) {
    return errosAuth.value.confirmPassword = "As senhas não coincidem"
  }

  isCadastrandoUsuario.value = true

  // CORREÇÃO: Chamada correta ao signUp com metadados para o trigger do banco
  const { error } = await supabase.auth.signUp({
    email: novoUsuarioForm.value.email,
    password: novoUsuarioForm.value.password,
    options: { 
      data: { 
        role: novoUsuarioForm.value.role 
      } 
    }
  })

  isCadastrandoUsuario.value = false

  if (error) {
    mostrarFeedback(error.message, 'erro')
  } else {
    mostrarFeedback("Usuário criado com sucesso!", 'sucesso')
    fecharModalNovoUsuario()
  }
}

// Lógica Novo Setor / Empresa
const abrirModalNovoSetor = () => {
  novoSetorNome.value = ''
  erroSetor.value = ''
  isModalNovoSetorOpen.value = true
}

const fecharModalNovoSetor = () => {
  isModalNovoSetorOpen.value = false
}

const cadastrarNovoSetor = async () => {
  if (!novoSetorNome.value) return erroSetor.value = "Campo obrigatório"
  isCadastrandoSetor.value = true
  const { error } = await supabase.from('empresas').insert([{ nome: novoSetorNome.value }])
  isCadastrandoSetor.value = false
  if (error) mostrarFeedback(error.message, 'erro')
  else { mostrarFeedback("Setor criado!", 'sucesso'); fetchEmpresas(); fecharModalNovoSetor() }
}

// --- FIM FUNÇÕES NOVAS ---

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

const fetchColaboradores = async () => {
  if (!tenantStore.selectedEmpresaId) return;
    
  const from = (paginaAtual.value - 1) * itensPorPagina;
  const to = from + itensPorPagina - 1;

  const { data, error, count } = await supabase
    .from('colaboradores')
    .select('*', { count: 'exact' })
    .range(from, to)
    .eq('empresa_id', tenantStore.selectedEmpresaId)
    .order('nome_completo', { ascending: true })
    
  if (!error) {
    colaboradores.value = data || []
    totalColaboradores.value = count || 0
  }
  
  isLoading.value = false;
}

const proximaPagina = () => {
  if (paginaAtual.value < totalPaginas.value) {
    paginaAtual.value++;
    fetchColaboradores();
  }
};

const paginaAnterior = () => {
  if (paginaAtual.value > 1) { 
    paginaAtual.value--;
    fetchColaboradores();
  }
};

const fetchSolicitacoes = async () => {
  const { data, error } = await supabase.from('solicitacoes').select('*').eq('status', 'Pendente');
  if (error) {
    console.error("Erro na busca de solicitações:", error.message);
    return;
  }
  solicitacoesPendentes.value = data || [];
};

const carregarDocumentos = async (id: string) => {
  const { data } = await supabase.from('linha_do_tempo').select('*').eq('colaborador_id', id).eq('tipo_evento', 'Upload de Documento').order('data_evento', { ascending: false })
  documentosColab.value = data || []
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
  await fetchColaboradores()
  
  if (userRole.value === 'adimim') {
    await fetchSolicitacoes()
  }
  
  setTimeout(() => { 
    isFirstLoad.value = false 
    isLoading.value = false
  }, 800)
})

const handleSalvarColaborador = async () => {
  erros.value = {}
  if (!colabEmEdicao.value.nome_completo) erros.value.nome_completo = 'Obrigatório'
  if (!colabEmEdicao.value.cpf) erros.value.cpf = 'Obrigatório'
  if (Object.keys(erros.value).length > 0) return mostrarFeedback('Verifique os campos obrigatórios.', 'erro')

  // Garante o vínculo com a empresa selecionada atualmente
  if (!colabEmEdicao.value.empresa_id) {
    colabEmEdicao.value.empresa_id = tenantStore.selectedEmpresaId
  }

  if (userRole.value === 'adimim' || !isEditando.value) {
    await executarComVerificacao(salvarDireto)
  } else {
    await enviarSolicitacao()
  }
}

const enviarSolicitacao = async () => {
  try {
    const dadosParaEnvio = JSON.parse(JSON.stringify(colabEmEdicao.value));
    const novaSolicitacao = { colaborador_id: colabEmEdicao.value.id, solicitante_id: usuarioAtual.value.id, solicitante_email: usuarioAtual.value.email, dados_novos: dadosParaEnvio, status: 'Pendente' }
    
    const { error } = await supabase.from('solicitacoes').insert([novaSolicitacao])
    if (error) throw error

    mostrarFeedback('Solicitação enviada para aprovação!', 'sucesso')
    fecharModal()
  } catch (err) {
    console.error('Erro detalhado:', err)
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
    if (data && data.length > 0) {
      await supabase.from('linha_do_tempo').insert([{ colaborador_id: data[0].id, tipo_evento: 'Admissão', descricao: `Admitido no cargo ${data[0].cargo}`, data_evento: data[0].data_admissao }])
    }
    mostrarFeedback('Cadastrado com sucesso!', 'sucesso')
  }
  
  fecharModal()
  isLoading.value = true
  await fetchColaboradores()
  isLoading.value = false
}

const aprovarSolicitacao = async (sol: any) => {
  try {
    const { id, created_at, updated_at, ...dadosParaAtualizar } = sol.dados_novos;
    const { error: errorColab } = await supabase.from('colaboradores').update(dadosParaAtualizar).eq('id', sol.colaborador_id);
    if (errorColab) throw errorColab;

    const { data: solAtualizada, error: errorSol } = await supabase.from('solicitacoes').update({ status: 'Aprovada' }).eq('id', sol.id).select();
    if (errorSol) throw errorSol;
    if (!solAtualizada || solAtualizada.length === 0) throw new Error('RLS (Políticas) bloqueou o UPDATE na tabela solicitacoes.');

    mostrarFeedback('Solicitação aprovada com sucesso!', 'sucesso');
    
    isLoading.value = true
    await fetchSolicitacoes()
    await fetchColaboradores()
    isLoading.value = false
  } catch (err) {
    console.error('Erro detalhado na aprovação:', err);
    mostrarFeedback('Erro ao gravar no banco. Verifique o console.', 'erro');
  }
};

const rejeitarSolicitacao = async (id: string) => {
  try {
    const { data: solRejeitada, error } = await supabase.from('solicitacoes').update({ status: 'Rejeitada' }).eq('id', id).select();
    if (error) throw error;
    if (!solRejeitada || solRejeitada.length === 0) throw new Error('RLS bloqueou a rejeição.');

    mostrarFeedback('Solicitação rejeitada.', 'sucesso');
    
    isLoading.value = true
    await fetchSolicitacoes()
    isLoading.value = false
  } catch (err) {
    console.error('Erro ao rejeitar:', err);
    mostrarFeedback('Falha ao atualizar solicitação. Verifique o console.', 'erro');
  }
};

const desligarColaborador = async (colab: any) => {
  const motivo = prompt('Motivo do desligamento (Ex: Pedido de Demissão, Justa Causa):')
  if (!motivo) return
  
  isLoading.value = true
  await supabase.from('colaboradores').update({ status: 'Desligado' }).eq('id', colab.id)
  await supabase.from('linha_do_tempo').insert([{ colaborador_id: colab.id, tipo_evento: 'Desligamento', descricao: motivo, data_evento: new Date().toISOString() }])
  
  await fetchColaboradores()
  isLoading.value = false
}

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

const handleLogout = async () => { 
  isLoggingOut.value = true;
  setInterval(() => {
    supabase.auth.signOut();
    router.push('/') 
  }, 2000);
}

const formatarData = (d: string) => d ? new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-'
const mostrarFeedback = (m: string, t: string) => { feedback.value = { mensagem: m, tipo: t }; setTimeout(() => feedback.value = { mensagem: '', tipo: '' }, 3000) }

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
  } else {
    mostrarFeedback('Erro ao enviar documento.', 'erro')
  }
  uploading.value = false
}

const visualizarDocumento = async (path: string) => {
  const { data, error } = await supabase.storage.from('documentos_colaboradores').createSignedUrl(path, 60)
  if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  if (error) mostrarFeedback('Erro ao abrir documento.', 'erro')
}

const lidarComExportacao = (event: Event) => {
  const select = event.target as HTMLSelectElement
  const acao = select.value

  if (acao === 'csv') {
    exportarCSV()
  } else if (acao === 'pdf') {
    exportarPDF()
  }
  select.value = ''
}

const exportarPDF = () => {
  const win = window.open('', '_blank')
  if (!win) return

  const linhasHtml = colaboradoresFiltrados.value.map(c => `
    <tr>
      <td>${c.nome_completo || '-'}</td>
      <td>${c.cpf || '-'}</td>
      <td>${c.email || '-'}</td>
      <td>${c.cargo || '-'}</td>
      <td>${c.departamento || '-'}</td>
      <td>${c.status || '-'}</td>
      <td>${c.data_admissao ? formatarData(c.data_admissao) : '-'}</td>
    </tr>
  `).join('')

  win.document.write(`
    <html>
      <head>
        <title>Relatório de Colaboradores</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; margin: 0; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h2 { margin: 0; color: #1e293b; }
          .header p { margin: 5px 0 0 0; color: #64748b; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; font-weight: bold; text-transform: uppercase; }
          tr:nth-child(even) { background-color: #f9fafb; }
          @media print {
            @page { margin: 10mm; size: landscape; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Relatório de Colaboradores</h2>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Departamento</th>
              <th>Status</th>
              <th>Admissão</th>
            </tr>
          </thead>
          <tbody>
            ${linhasHtml}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); };
          window.onafterprint = function() { window.close(); };
        <\/script>
      </body>
    </html>
  `)
  
  win.document.close()
}

const exportarCSV = () => {
  const SEPARADOR = ';'
  const cabecalho = ['Nome', 'CPF', 'Email', 'Cargo', 'Depto', 'Status', 'Admissao']
  const linhas = colaboradoresFiltrados.value.map((c) =>
    [c.nome_completo, c.cpf, c.email, c.cargo, c.departamento, c.status, c.data_admissao]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(SEPARADOR)
  )
  const csv = '\ufeff' + [cabecalho.join(SEPARADOR), ...linhas].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'colaboradores.csv'; link.click()
}

const imprimirDossie = (c: any) => {
  const win = window.open('', '_blank')
  const formatarDataSegura = (data: string) => { try { return typeof formatarData === 'function' ? formatarData(data) : data } catch (e) { return data } }

  win?.document.write(`
    <html>
    <head>
      <title>Dossiê - ${c.nome_completo}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #333; margin: 0; }
        .header { display: flex; justify-content: space-between; border: 1px solid #000; padding: 15px; margin-bottom: 20px; }
        .header-left { width: 25%; font-weight: bold; font-size: 14px; }
        .header-center { width: 50%; line-height: 1.4; text-align: center; }
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
          <h2>DOSSIÊ DE COLABORADOR</h2>
          <p>Documento de uso interno gerado pelo sistema</p>
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
      <div class="watermark">Gerado automaticamente pelo sistema de gestão</div>
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

.ExportacaoSelect {
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

.ExportarCSV, .ExportarCSV:hover {
  background-color: var(--success-bg);
  color: var(--text-main);
  text-align: center;  
}
.ExportarPDF, .ExportarPDF:hover {
  background-color: var(--danger-bg);
  color: var(--text-main);
  text-align: center;  
}

/* Tratamento de Erros visuais nos Forms */
input.error, select.error {
  border-color: var(--danger) !important;
  background-color: var(--danger-bg);
}

.error-message {
  color: var(--danger);
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
  font-weight: 500;
}
</style>