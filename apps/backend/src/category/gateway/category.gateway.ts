import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Category } from '@prisma/client';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CategoryGateway {
    @WebSocketServer()
    server: Server;

    emitNewCategory(category: Category) {
        this.server.emit('newCategory', category);
    }

    emitCategoryDeleted(id: string) {
        this.server.emit('categoryDeleted', id);
    }
} 