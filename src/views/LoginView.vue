<template>
  <div class="login-wrapper">
    <!-- Lado Esquerdo: Carrossel Hero (Estrutura Nova) -->
    <div class="login-hero">
      <div class="carousel-container">
        <div
          v-for="(img, index) in carouselImages"
          :key="index"
          class="carousel-slide"
          :class="{ active: index === currentImageIndex }"
          :style="{ backgroundImage: `url(${img})` }"
        ></div>
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content">
        <div class="hero-time">
          <h2>{{ currentTime }}</h2>
          <p>{{ currentDate }}</p>
        </div>
        <div class="hero-text">
          <h1>Gestão Inteligente<br /><span class="text-accent">Para o seu Negócio.</span></h1>
          <p>Plataforma unificada para gestão industrial e comercial em tempo real.</p>
        </div>
        
        <!-- Indicadores do Carrossel (Dots) -->
        <div class="carousel-dots">
          <span
            v-for="(img, index) in carouselImages"
            :key="index"
            class="dot"
            :class="{ active: index === currentImageIndex }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </div>

    <!-- Lado Direito: Painel de Login (WIDER - MAIS LARGO) -->
    <div class="login-panel">
      <!-- Toggle de Tema -->
      <div class="theme-toggle-wrapper">
        <button @click="toggleTheme" class="btn-theme" :title="theme === 'light' ? 'Mudar para Escuro' : 'Mudar para Claro'">
          <svg v-if="theme === 'light'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.32 1.27 4.35 3.16 5.41a2 2 0 0 0 .84 1.59L9 18h6l0-1a2 2 0 0 0 .84-1.59A7 7 0 0 0 12 2z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="var(--accent, yellow)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a7 7 0 0 0-7 7c0 2.32 1.27 4.35 3.16 5.41a2 2 0 0 0 .84 1.59L9 18h6l0-1a2 2 0 0 0 .84-1.59A7 7 0 0 0 12 2z"></path><line x1="12" y1="2" x2="12" y2="2"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          </svg>
        </button>
      </div>

      <div class="login-card">
        <div class="brand-logo-mobile">
          <h2 class="text-accent">MJ</h2>
        </div>
        
        <div class="login-header">
          <h2>Bem-vindo</h2>
          <p>Faça login para acessar sua conta</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="input-group">
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <input type="email" id="email" v-model="email" placeholder="E-mail Corporativo" required />
            </div>
          </div>

          <div class="input-group">
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" placeholder="Senha" required />
              <button type="button" class="btn-toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </label>
          </div>

          <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Acessando...' : 'ACESSAR SISTEMA' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useTheme } from '../composables/useDarkMode'

// 1. IMPORTE AS IMAGENS AQUI (Ajuste o '../assets/...' dependendo de onde o LoginView.vue está)
import img1 from '../assets/imgs/img1.jpg'
import img2 from '../assets/imgs/img2.jpg'
import img3 from '../assets/imgs/img3.jpg'

const { theme, toggleTheme } = useTheme()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

// Lógica de relógio para o Hero
const currentTime = ref('')
const currentDate = ref('')
let timerInterval: ReturnType<typeof setInterval>

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  currentDate.value = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

// 2. USE AS VARIÁVEIS IMPORTADAS NO SEU ARRAY
const carouselImages = ref([
  img1, 
  img2, 
  img3
])
const currentImageIndex = ref(0)
let carouselInterval: ReturnType<typeof setInterval>

const nextSlide = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % carouselImages.value.length
}

const goToSlide = (index: number) => {
  currentImageIndex.value = index
  clearInterval(carouselInterval)
  startCarousel()
}

const startCarousel = () => {
  carouselInterval = setInterval(nextSlide, 7000)
}

onMounted(() => {
  updateTime()
  timerInterval = setInterval(updateTime, 60000)
  startCarousel()
})

onUnmounted(() => {
  clearInterval(timerInterval)
  clearInterval(carouselInterval)
})
// Sua lógica de Login permanece inalterada
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
    const infoDispositivo = navigator.userAgent
    let ipUsuario = 'Desconhecido'
    let localUsuario = 'Desconhecido'

    try {
      // Trocando para o ipinfo.io, que costuma liberar o localhost sem problemas
      const respostaLocal = await fetch('https://ipinfo.io/json')
      const dadosLocal = await respostaLocal.json()
      
      if (dadosLocal.ip) {
        ipUsuario = dadosLocal.ip
        localUsuario = `${dadosLocal.city}, ${dadosLocal.region} - ${dadosLocal.country}`
      }
    } catch (e) {
      console.warn('Falha ao buscar localização: ', e)
    }

    try {
      const { error: historyError } = await supabase.from('historico_logins').insert([{
        user_id: authData.user.id,
        user_email: email.value,
        ip: ipUsuario,
        localizacao: localUsuario,
        dispositivo: infoDispositivo
      }])

      // Se a trigger no Postgres disparar o RAISE EXCEPTION, cairá aqui
      if (historyError) {
        throw new Error(historyError.message);
      }

      // Tudo certo, as credenciais e o local batem
      router.push('/home')

    } catch (e) {
      console.warn('Falha na validação de segurança:', e)
      errorMessage.value = 'Acesso bloqueado: Dispositivo ou localização não autorizados.'
      
      // Desloga o usuário imediatamente pois ele não passou na verificação de local
      await supabase.auth.signOut()
    }
  }

  isLoading.value = false
}
</script>

<style scoped>
@import '../assets/login.css';
</style>