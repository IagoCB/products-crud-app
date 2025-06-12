import { trpc } from '../utils/trpc';
import { useWebSocket } from './useWebSocket';
import { useEffect } from 'react';
import type { CreateProductDtoType, UpdateProductDtoType } from '@repo/types';

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

    const { onProductCreated, onProductUpdated, onProductDeleted } = useWebSocket();

    useEffect(() => {
        const unsubscribeCreated = onProductCreated(() => {
            refetch();
        });

        const unsubscribeUpdated = onProductUpdated(() => {
            refetch();
        });

        const unsubscribeDeleted = onProductDeleted(() => {
            refetch();
        });

        return () => {
            unsubscribeCreated();
            unsubscribeUpdated();
            unsubscribeDeleted();
        };
    }, [onProductCreated, onProductUpdated, onProductDeleted, refetch]);

    const createProduto = async (data: CreateProductDtoType) => {
        try {
            await create.mutateAsync(data);
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            throw error;
        }
    };

    const updateProduto = async (id: string, data: UpdateProductDtoType) => {
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