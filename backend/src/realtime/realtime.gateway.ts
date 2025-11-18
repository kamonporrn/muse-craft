import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private clients = new Map<string, Socket>();

  handleConnection(client: Socket) {
    this.clients.set(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);
    client.emit("connected", { message: "Connected to real-time server" });
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Subscribe to entity updates
  @SubscribeMessage("subscribe")
  handleSubscribe(
    @MessageBody() data: { entity: string },
    @ConnectedSocket() client: Socket
  ) {
    const { entity } = data;
    client.join(`entity:${entity}`);
    this.logger.log(`Client ${client.id} subscribed to ${entity}`);
    return { success: true, message: `Subscribed to ${entity}` };
  }

  @SubscribeMessage("unsubscribe")
  handleUnsubscribe(
    @MessageBody() data: { entity: string },
    @ConnectedSocket() client: Socket
  ) {
    const { entity } = data;
    client.leave(`entity:${entity}`);
    this.logger.log(`Client ${client.id} unsubscribed from ${entity}`);
    return { success: true, message: `Unsubscribed from ${entity}` };
  }

  // Broadcast methods for different entities
  broadcastUserUpdate(action: "create" | "update" | "delete", data: any) {
    this.server.to("entity:users").emit("user:update", { action, data });
    this.logger.log(`Broadcasted user ${action}: ${data.id || data}`);
  }

  broadcastProductUpdate(action: "create" | "update" | "delete", data: any) {
    this.server.to("entity:products").emit("product:update", { action, data });
    this.logger.log(`Broadcasted product ${action}: ${data.id || data}`);
  }

  broadcastOrderUpdate(action: "create" | "update" | "delete", data: any) {
    this.server.to("entity:orders").emit("order:update", { action, data });
    this.logger.log(`Broadcasted order ${action}: ${data.id || data}`);
  }

  broadcastAdminLogUpdate(action: "create" | "update" | "delete", data: any) {
    this.server.to("entity:admin-logs").emit("admin-log:update", {
      action,
      data,
    });
    this.logger.log(`Broadcasted admin-log ${action}: ${data.id || data}`);
  }

  // Generic broadcast method
  broadcast(entity: string, action: string, data: any) {
    this.server.to(`entity:${entity}`).emit(`${entity}:update`, {
      action,
      data,
    });
  }
}

