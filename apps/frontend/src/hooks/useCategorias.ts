import { trpc } from '../utils/trpc';

export function useCategorias() {
    const { data, isLoading, error, refetch } = trpc.categoria.getAll.useQuery();

    const sortedCategories = data ? [...data].sort((a: any, b: any) => a.name.localeCompare(b.name)) : [];

    return {
        categorias: sortedCategories,
        isLoading,
        error,
        refetch,
    };
} 