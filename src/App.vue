<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

// Ao carregar, verifica se o usuário já tinha uma preferência salva
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
});
</script>

<template>
  <div class="app-container">

    <router-view />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

header {
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.btn-theme {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: white;
  border: none;
}
</style>