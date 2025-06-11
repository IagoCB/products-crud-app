import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@repo/backend/apps/backend/src/trpc';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: import.meta.env.VITE_API_URL + "/trpc" || 'http://localhost:3000/trpc',
            headers: () => {
                return {};
            },
        }),
    ],
}); 