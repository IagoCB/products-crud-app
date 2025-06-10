import { trpc } from '../utils/trpc';

export function useCategorias() {
    const { data, isLoading, error } = trpc.categoria.getAll.useQuery();
    return {
        categorias: data || [],
        isLoading,
        error,
    };
} 