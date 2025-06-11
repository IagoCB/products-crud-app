import { trpc } from '../utils/trpc';

export function useCategorias() {
    const { data, isLoading, error, refetch } = trpc.categoria.getAll.useQuery();
    return {
        categorias: data || [],
        isLoading,
        error,
        refetch,
    };
} 