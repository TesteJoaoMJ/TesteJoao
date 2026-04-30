<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logo-icon">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span class="app-name">Sistema<span class="bold">ERP</span></span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path" class="nav-item" exact-active-class="active">
            <span class="icon" v-html="item.icon"></span>
            <span class="label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="version-tag">v1.0.0</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Definição dos itens de menu baseados nas rotas fornecidas
// Mapeamos ícones específicos para cada rota para melhorar a UX
const menuItems = ref([
  {
    path: '/home',
    label: 'Início',
    // Ícone: Home
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>'
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    // Ícone: LayoutDashboard
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>'
  },
  {
    path: '/usuarios',
    label: 'Usuários',
    // Ícone: Users
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
  },
  {
    path: '/setores',
    label: 'Setores',
    // Ícone: Grid/Layers
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>'
  },
  {
    path: '/auditoria',
    label: 'Auditoria',
    // Ícone: ClipboardList
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>'
  },
]);
</script>

<style scoped>
/* Variáveis locais para consistência caso não existam globalmente */
:root {
  --sidebar-width: 260px;
  /* Usando as cores que você já possui na navbar */
  --bg-sidebar: var(--bg-surface, #ffffff);
  --text-nav: var(--text-main, #1f2937);
  --text-nav-muted: var(--text-muted, #6b7280);
  --border-color: var(--border, #e5e7eb);
  --primary-color: var(--primary, #6366f1);
  --bg-hover: var(--bg-surface-hover, #f3f4f6);
}

.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 0;
  z-index: 100; /* Garante que fique sobre o conteúdo se necessário */
  transition: background 0.3s, border 0.3s;
}

/* Header */
.sidebar-header {
  height: 64px; /* Mesma altura aproximada da navbar para alinhamento visual */
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.logo-placeholder {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  color: var(--primary-color);
}

.app-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-nav);
  letter-spacing: -0.025em;
}

.app-name .bold {
  font-weight: 700;
}

/* Navegação */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0.75rem;
  overflow-y: auto; /* Scroll se houver muitos itens */
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-nav);
  font-size: 0.9375rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* Estado Hover (UX) */
.nav-item:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

/* Ícone dentro do item (não ativo) */
.nav-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-nav-muted);
  transition: color 0.2s ease;
}

.nav-item:hover .icon {
  color: var(--primary-color);
}

/* --- Estado Ativo (router-link-exact-active) --- */
/* Boa UI/UX: Fundo suave da cor primária e texto na cor primária */
.nav-item.active {
  background-color: color-mix(in srgb, var(--primary-color) 10%, transparent);
  color: var(--primary-color);
  font-weight: 600;
}

/* Ícone no estado ativo */
.nav-item.active .icon {
  color: var(--primary-color);
}

/* Pequeno indicador visual na esquerda (opcional, melhora a UX) */
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  height: 20px;
  width: 4px;
  background-color: var(--primary-color);
  border-radius: 0 4px 4px 0;
}

/* Rodapé */
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
}

.version-tag {
  font-size: 0.75rem;
  color: var(--text-nav-muted);
  background-color: var(--bg-hover);
  padding: 2px 8px;
  border-radius: 999px;
}

/* Scrollbar estilizada para a nav (opcional, melhora UX) */
.sidebar-nav::-webkit-scrollbar {
  width: 5px;
}
.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 99px;
}
</style>