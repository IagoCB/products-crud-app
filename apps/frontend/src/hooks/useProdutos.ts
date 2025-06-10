import { trpc } from '../utils/trpc';
import type { CreateProductDto, UpdateProductDto } from '@repo/types';

export function useProdutos() {
    const { data, refetch } = trpc.produto.getAll.useQuery();
    const create = trpc.produto.create.useMutation({
        onSuccess: () => refetch()
    });
    const update = trpc.produto.update.useMutation({
        onSuccess: () => refetch()
    });
    const remove = trpc.produto.delete.useMutation({
        onSuccess: () => refetch()
    });

    // Subscription para tempo real
    trpc.produto.onProdutoChanged.useSubscription(undefined, {
        onData: () => refetch(),
    });

    const createProduto = async (data: CreateProductDto) => {
        try {
            await create.mutateAsync(data);
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    };

    const updateProduto = async (id: string, data: UpdateProductDto) => {
        try {
            await update.mutateAsync({ id, ...data });
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            throw error;
        }
    };

    const deleteProduto = async (id: string) => {
        try {
            await remove.mutateAsync(id);
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            throw error;
        }
    };

    return {
        produtos: data || [],
        createProduto,
        updateProduto,
        deleteProduto,
        isLoading: create.isLoading || update.isLoading || remove.isLoading,
        error: create.error || update.error || remove.error
    };
} 