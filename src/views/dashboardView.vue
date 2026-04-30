<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface LoginHistory {
  id: string
  user_email: string
  ip: string
  localizacao: string
  dispositivo: string
  data_login: string
}

</script>

<template>
  <div class="audit-container">
    <header class="page-header">
      <h1 class="text-primary">DashBoard</h1>
    </header>
  </div>
</template>

<style scoped>
.audit-container {
  padding: 2rem;
  background-color: var(--bg-system); /* Minimalismo */
}

.page-header h1 {
  color: #3b82f6; /* Azul vibrante conforme seu padrão */
  margin-bottom: 0.5rem;
}
</style>