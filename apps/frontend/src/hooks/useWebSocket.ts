import { useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export function useWebSocket() {
    const _url = import.meta.env.VITE_API_URL;
    const socket = io(_url, {
        withCredentials: true,
    });

    useEffect(() => {
        socket.on('connect', () => {
        });

        socket.on('disconnect', () => {
        });

        socket.on('error', (error) => {
            console.error('❌ Erro no WebSocket:', error);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const onProductCreated = useCallback((callback: (product: any) => void) => {
        socket.on('product_created', callback);
        return () => socket.off('product_created', callback);
    }, [socket]);

    const onProductUpdated = useCallback((callback: (product: any) => void) => {
        socket.on('product_updated', callback);
        return () => socket.off('product_updated', callback);
    }, [socket]);

    const onProductDeleted = useCallback((callback: (productId: string) => void) => {
        socket.on('product_deleted', callback);
        return () => socket.off('product_deleted', callback);
    }, [socket]);

    return {
        onProductCreated,
        onProductUpdated,
        onProductDeleted,
    };
} 