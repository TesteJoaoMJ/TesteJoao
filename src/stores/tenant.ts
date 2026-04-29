import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useTenantStore = defineStore('tenant', () => {
  // Carrega a última empresa selecionada do localStorage ou nulo
  const selectedEmpresaId = ref(localStorage.getItem('selectedEmpresaId') || '')

  // Salva no localStorage sempre que mudar
  watch(selectedEmpresaId, (newId) => {
    localStorage.setItem('selectedEmpresaId', newId)
    // Recarrega a página ou emite evento para atualizar consultas
    window.location.reload() 
  })

  return { selectedEmpresaId }
})