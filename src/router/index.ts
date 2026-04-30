import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AuditoriaView from '../views/AuditoriaView.vue'
import DasboardView from '../views/dashboardView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auditoria',
      name: 'auditoria',
      component: AuditoriaView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DasboardView,
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
    }
  ],
})

export default router
