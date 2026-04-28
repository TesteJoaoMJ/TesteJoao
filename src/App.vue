<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // Recupera o tema salvo ou usa o do sistema
  const savedTheme = localStorage.getItem('user-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});
</script>

<template>
  <div class="app-main">
    <router-view />
  </div>
</template>

<style>
/* Estilo para garantir que o fundo da página toda mude */
body, html {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  margin: 0;
  transition: background-color 0.3s;
}
</style>