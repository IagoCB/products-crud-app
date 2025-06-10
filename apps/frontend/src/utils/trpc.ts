import { createTRPCReact } from '@trpc/react-query';
import { createWSClient, wsLink, httpBatchLink, splitLink } from '@trpc/client';
import type { AppRouter } from '@repo/types';

export const trpc = createTRPCReact<AppRouter>();

const wsClient = createWSClient({
    url: import.meta.env.VITE_WS_URL || 'ws://localhost:3001'
});

export const trpcClient = trpc.createClient({
    links: [
        splitLink({
            condition: (op) => op.type === 'subscription',
            true: wsLink({ client: wsClient }),
            false: httpBatchLink({
                url: import.meta.env.VITE_API_URL || 'http://localhost:3000/trpc',
                headers: () => {
                    return {};
                },
            }),
        }),
    ],
}); 