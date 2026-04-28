// src/composables/useTheme.ts
import { ref, onMounted } from 'vue'

const theme = ref<'light' | 'dark'>('light')

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('user-theme', theme.value)
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('user-theme') as 'light' | 'dark' | null
    if (savedTheme) {
      theme.value = savedTheme
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return { theme, toggleTheme, initTheme }
}