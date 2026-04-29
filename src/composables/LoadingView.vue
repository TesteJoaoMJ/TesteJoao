<template>
  <Transition name="fade">
    <div v-if="isVisible" class="loading-overlay">
      <div class="loading-content">
        <!-- Spinner minimalista mas colorido -->
        <div class="spinner-ring"></div>
        
        <div class="text-container">
          <h2 class="loading-title">{{ title }}</h2>
          <p class="loading-message">{{ message }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean;
  title?: string;
  message?: string;
}

withDefaults(defineProps<Props>(), {
  isVisible: false,
  title: 'Carregando',
  message: 'Por favor, aguarde um momento...'
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* Usando as variáveis globais corretas */
  background-color: var(--bg-app);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /* Ajustado para usar as variáveis do seu tema */
  background: radial-gradient(circle at center, var(--bg-surface) 0%, var(--bg-app) 100%);
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* Spinner com paleta de cores vivas mantendo traços finos */
.spinner-ring {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: var(--primary); /* Azul/Accent do tema */
  border-right-color: #8b5cf6; 
  border-bottom-color: #ec4899; 
  border-left-color: var(--success); 
  animation: spin 1s linear infinite;
}

.text-container {
  text-align: center;
  animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.loading-message {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0;
}

/* Animações */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Transição suave de entrada e saída */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>