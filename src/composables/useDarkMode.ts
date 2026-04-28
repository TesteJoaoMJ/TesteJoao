import { ref, onMounted } from 'vue';

const isDark = ref(false);

export function useDarkMode() {
  const toggleDark = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('user-theme', isDark.value ? 'dark' : 'light');
    updateTheme();
  };

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem('user-theme');
    // Verifica preferência salva ou do sistema
    isDark.value = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    updateTheme();
  });

  return { isDark, toggleDark };
}