import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

interface Category {
    id: string;
    name: string;
    products: any[];
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CategoryGateway {
    @WebSocketServer()
    server: Server;

    emitNewCategory(category: Category) {
        this.server.emit('category_created', category);
    }

    emitCategoryDeleted(id: string) {
        this.server.emit('category_deleted', id);
    }
} 