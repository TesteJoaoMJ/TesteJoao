# Sistema de Gestão de Colaboradores

## Objetivo

Desenvolver uma aplicação web completa para gestão de colaboradores utilizando Vue 3 com TypeScript, integração com Supabase como backend (autenticação e banco de dados) e deploy na plataforma Render.

---

## Stack Obrigatória

* Frontend: Vue.js 3 + TypeScript
* Backend (BaaS): Supabase
* Deploy: Render

---

## Autenticação

O sistema deve conter:

* Cadastro de usuário com email e senha
* Validação de email obrigatória (confirmação via Supabase)
* Login
* Tratamento de erros e feedback ao usuário

---

## CRUD de Colaboradores

### Cadastro

O sistema deve permitir registrar, no mínimo, os seguintes dados:

* Nome completo
* CPF
* Data de nascimento
* Email
* Telefone
* Endereço completo
* Cargo atual
* Departamento
* Salário
* Data de admissão
* Status (Ativo / Desligado)

---

### Listagem (Grid)

A listagem deve:

* Exibir os dados em colunas separadas (não agrupar informações no mesmo campo)

* Possuir organização visual clara

* Conter:

  * Campo de busca global
  * Filtros (status, cargo, departamento, etc.)

* A última coluna deve conter ações:

  * Editar
  * Excluir
  * Imprimir dossiê
  * Desligar (demissão)

---

### Edição

* Deve ser realizada via modal
* Permitir alteração dos dados do colaborador
* Exibir feedback ao salvar ou em caso de erro

---

### Desligamento

* Alterar status para "Desligado"
* Registrar evento na linha do tempo
* Permitir readmissão mantendo histórico

---

## Linha do Tempo

Cada colaborador deve possuir um histórico contendo:

* Admissão
* Alterações de cargo
* Alterações salariais
* Desligamento(s)
* Readmissão (quando aplicável)

---

## Cofre de Documentos

Cada colaborador deve possuir uma área para armazenamento de arquivos:

* Documentos pessoais
* Atestados médicos
* Contratos
* Outros documentos relevantes

---

## Interface (UI/UX)

A aplicação deve apresentar:

* Interface limpa e organizada
* Navegação intuitiva
* Botões claros e bem identificados
* Separação visual adequada das informações
* Feedback visual para ações do usuário

---

## Feedback ao Usuário

O sistema deve informar claramente:

* Sucesso em operações realizadas
* Erros ao executar ações
* Avisos importantes

---

## Diferenciais (Critérios de Avaliação)

Serão considerados diferenciais:

* Validação robusta de formulários
* Máscaras de entrada (CPF, telefone, etc.)
* Upload de arquivos com visualização prévia
* Exportação de dados (CSV ou PDF)
* Impressão de dossiê estruturado
* Paginação ou virtualização de lista
* Responsividade
* Tema escuro
* Controle de permissões por tipo de usuário
* Boas práticas de organização de código

---

## Boas Práticas Esperadas

* Código organizado e modular
* Separação de responsabilidades
* Tipagem adequada com TypeScript
* Uso consistente de padrões do framework
* Tratamento de erros
* Padronização de código

---

## Logs e Mensagens

A aplicação deve apresentar logs visuais para o usuário, incluindo:

* Mensagens de sucesso
* Mensagens de erro
* Mensagens informativas

---

## Entrega

O projeto deve conter:

* Código funcional
* Interface utilizável
* Integração com Supabase
* Deploy realizado no Render
* Instruções claras para execução local

---

## Observações

O foco da avaliação será:

* Organização
* Clareza
* Qualidade da implementação
* Experiência do usuário
* Estrutura do código
