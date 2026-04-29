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
      const respostaLocal = await fetch('https://ipapi.co/json/')
      const dadosLocal = await respostaLocal.json()
      if (dadosLocal.ip) {
        ipUsuario = dadosLocal.ip
        localUsuario = `${dadosLocal.city}, ${dadosLocal.region} - ${dadosLocal.country_name}`
      }
    } catch (e) {
      console.warn('Falha ao buscar localização.')
    }

    try {
      await supabase.from('historico_logins').insert([{
        user_id: authData.user.id,
        user_email: email.value,
        ip: ipUsuario,
        localizacao: localUsuario,
        dispositivo: infoDispositivo
      }])
    } catch (e) {
      console.warn('Falha ao registrar log de login:', e)
    } finally {
      router.push('/home')
    }
  }

  isLoading.value = false
}
</script>

<style scoped>
/* Layout Principal */
.login-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--bg-app);
}

/* Lado Esquerdo - Carrossel Hero (CSS Atualizado) */
.login-hero {
  flex: 1; /* Ocupa o espaço restante */
  position: relative;
  display: flex;
  flex-direction: column;
  color: #ffffff;
}

.carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.5s ease-in-out; /* Efeito de fade suave */
}

.carousel-slide.active {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.hero-time {
  margin-bottom: 2rem;
}

.hero-time h2 {
  font-size: 4rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.hero-time p {
  font-size: 1.1rem;
  opacity: 0.8;
  text-transform: capitalize;
  margin-top: 0.5rem;
}

.hero-text h1 {
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.hero-text p {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 80%;
}

.text-accent {
  color: blue;
}

/* Dots do Carrossel */
.carousel-dots {
  position: absolute;
  bottom: 2rem;
  left: 4rem;
  display: flex;
  gap: 0.75rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #ffffff;
  transform: scale(1.2);
}

/* Lado Direito - Painel de Login (WIDER CSS) */
.login-panel {
  width: 100%;
  /* AUMENTADO: De 500px para 680px para dar mais destaque */
  max-width: 680px; 
  background-color: var(--bg-surface);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: -5px 0 25px rgba(0,0,0,0.05);
  z-index: 2;
}

.theme-toggle-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
}

.btn-theme {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-theme:hover {
  background: var(--bg-surface-hover);
  color: var(--text-main);
}

.login-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Centraliza o formulário dentro do painel mais largo */
  padding: 0 10% 4rem 10%; 
}

.brand-logo-mobile {
  display: none;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 800;
}

.login-header {
  text-align: left;
  margin-bottom: 2.5rem;
}

.login-header h2 {
  font-size: 2rem; /* Ligeiramente maior */
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--text-muted);
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  opacity: 0.6;
}

.input-wrapper input {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 3rem; /* Padding ligeiramente maior */
  background-color: var(--bg-surface);
  color: var(--text-main);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem; /* Fonte maior */
  transition: all 0.2s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-bg);
}

.btn-toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  margin-top: -0.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  cursor: pointer;
}

.forgot-password {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-submit {
  width: 100%;
  padding: 1rem; /* Botão mais robusto */
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.2s;
  margin-top: 1rem;
  letter-spacing: 0.5px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-submit:disabled {
  background-color: var(--border);
  color: var(--text-muted);
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: var(--danger);
  font-size: 0.9rem;
  text-align: center;
  background: var(--danger-bg);
  padding: 0.75rem;
  border-radius: 6px;
}

.login-footer {
  margin-top: 3rem;
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-muted);
}

.login-footer a {
  text-decoration: none;
  font-weight: 600;
}

/* Responsividade Mobile */
@media (max-width: 1024px) {
    /* Ajuste para tablets e telas médias */
    .login-panel {
        max-width: 550px;
    }
    .hero-text h1 {
        font-size: 2.5rem;
    }
}

@media (max-width: 900px) {
  .login-hero {
    display: none;
  }
  
  .login-panel {
    max-width: 100%;
  }

  .brand-logo-mobile {
    display: block;
  }

  .login-card {
    padding: 0 2rem 2rem 2rem;
  }
}
</style>