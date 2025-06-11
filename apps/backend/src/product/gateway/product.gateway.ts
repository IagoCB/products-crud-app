import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Product } from '@prisma/client';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})
export class ProductGateway {
  @WebSocketServer()
  server: Server;

  emitNewProduct(product: Product) {
    this.server.emit('product_created', product);
  }

  emitProductDeleted(productId: string) {
    this.server.emit('product_deleted', productId);
  }

  emitProductUpdated(product: Product) {
    this.server.emit('product_updated', product);
  }
}
