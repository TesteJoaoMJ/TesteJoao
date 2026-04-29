import { ref } from 'vue';
// Certifique-se de que o caminho para a sua instância do Supabase está correto
import { supabase } from '@/lib/supabase';

export interface Colaborador {
  id: string;
  nome: string;
  status: 'Ativo' | 'Desligado';
  cargo: string;
  email: string;
}

export function useColaboradores() {
  const colaboradores = ref<Colaborador[]>([]);
  const isDataLoading = ref(false);
  const totalCount = ref(0);
  const pageSize = 10;
  const currentPage = ref(0);

  const carregarColaboradores = async (reset = false, search = '', statusFilter = '') => {
    if (reset) {
      currentPage.value = 0;
      colaboradores.value = [];
    }
    
    isDataLoading.value = true;
    
    // Cálculo de paginação
    const start = currentPage.value * pageSize;
    const end = start + pageSize - 1;

    try {
      let query = supabase
        .from('colaboradores')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('nome', { ascending: true });

      // Aplicação de filtros caso existam
      if (search) {
        query = query.ilike('nome', `%${search}%`);
      }
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      if (data) {
        if (reset) {
          colaboradores.value = data as Colaborador[];
        } else {
          colaboradores.value = [...colaboradores.value, ...(data as Colaborador[])];
        }
      }
      
      if (count !== null) {
        totalCount.value = count;
      }
      
      currentPage.value++;
    } catch (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
    } finally {
      isDataLoading.value = false;
    }
  };

  const hasMoreData = () => {
    return colaboradores.value.length < totalCount.value;
  };

  return {
    colaboradores,
    isDataLoading,
    totalCount,
    carregarColaboradores,
    hasMoreData
  };
}