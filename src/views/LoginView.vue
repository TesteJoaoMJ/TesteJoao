<template>
  <div class="login-container">
    <div class="login-card">
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
      <h2>Gestão de Colaboradores</h2>
      <p>Faça login para acessar o sistema</p>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">E-mail</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="exemplo@empresa.com.br"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Digite sua senha"
            required
          />
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useTheme } from '../composables/useDarkMode'
const { theme, toggleTheme } = useTheme()

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    if (error.message === 'Invalid login credentials') {
      errorMessage.value = 'E-mail ou senha incorretos. Verifique seus dados.'
    } else if (error.message === 'Email not confirmed') {
      errorMessage.value = 'Por favor, confirme seu e-mail antes de acessar.'
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage.value = 'Erro de conexão. Verifique sua internet.'
    } else {
      errorMessage.value = 'Ocorreu um erro inesperado: ' + error.message
    }
  } else {
    // Se deu certo, redireciona para a Home
    const infoDispositivo = navigator.userAgent
    let ipUsuario = 'Desconhecido'
    let localUsuario = 'Desconhecido'

    try {
      const respostaLocal = await fetch('https://ipapi.co/json/')
      const dadosLocal = await respostaLocal.json()
      if (dadosLocal.ip) {
        ipUsuario = dadosLocal.ip
        localUsuario = `${dadosLocal.city}, ${dadosLocal.region} - ${dadosLocal.country_name}`
      }
    } catch (e) {
      console.warn('Falha ao buscar localização.')
    }

    // 3. GRAVA NA CÂMERA DE SEGURANÇA: Salva o log na sua tabela
    // Note que usamos o authData.user.id para saber exatamente QUEM logou
    try{
      await supabase.from('historico_logins').insert([{
      user_id: authData.user.id,
      user_email: email.value,
      ip: ipUsuario,
      localizacao: localUsuario,
      dispositivo: infoDispositivo
    }])

    }catch(e){
      console.warn('Falha ao registrar log de login:', e)
    }finally {
      router.push('/home')
    }
  }

  isLoading.value = false
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  background: var(--bg-card);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-card h2 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.login-card p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:disabled {
  background-color: var(--bg-input);
  cursor: not-allowed;
}

.btn-white {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-main);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.error-msg {
  color: #d9534f;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>