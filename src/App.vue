<script setup lang="ts">
import { onMounted } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './composables/NavBar.vue'; // Verifique o caminho

const route = useRoute();

// Opcional: Esconde a nav na tela de Login (se a rota for '/')
const deveMostrarNav = computed(() => {
  return route.path !== '/'; 
});

onMounted(() => {
  // Recupera o tema salvo ou usa o do sistema
  const savedTheme = localStorage.getItem('user-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});
</script>

<template>
  <div class="app-layout">
    <SideBar />
    
    <div class="main-wrapper">
      <NavBar />
      
      <main class="content-container">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
/* CSS Global ou no App.vue */
:root {
  --sidebar-width: 260px; /* Deve bater com o valor na SideBar.vue */
}

body {
  margin: 0;
  padding: 0;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* Margem esquerda do tamanho da sidebar para não sobrepor */
  margin-left: var(--sidebar-width); 
  transition: margin-left 0.3s ease;
}

.content-container {
  flex: 1;
  padding: 2rem; /* Espaçamento interno padrão para todas as telas */
  background-color: var(--bg-app, #000000); /* Cor de fundo atrás dos cards */
}
</style>