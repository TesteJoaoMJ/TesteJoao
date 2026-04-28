<template>
  <div class="login-container">
    <div class="login-card">
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
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-card h2 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.login-card p {
  color: #666;
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
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:disabled {
  background-color: #a0d8c0;
  cursor: not-allowed;
}

.error-msg {
  color: #d9534f;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>