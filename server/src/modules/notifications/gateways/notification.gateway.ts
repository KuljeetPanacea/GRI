import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'src/core/logger';
import { NotificationService } from '../services/notification.service';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: '*',
  }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = LoggerService.getLogger('NotificationGateway');
  private userSockets: Map<string, Set<string>> = new Map();
  
  @WebSocketServer()
  server: Server;
  
  constructor(
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService
  ) {}
  
  // Handle client connection
  async handleConnection(client: Socket): Promise<void> {
    try {
      // Authenticate user from token
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }
      
      // Verify token and extract user/tenant info
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      const tenantId = payload.tenantId;
      
      if (!userId || !tenantId) {
        client.disconnect();
        return;
      }
      
      // Register client for this user
      const userKey = `${tenantId}:${userId}`;
      
      if (!this.userSockets.has(userKey)) {
        this.userSockets.set(userKey, new Set());
      }
      
      this.userSockets.get(userKey).add(client.id);
      
      // Join room for this user
      client.join(userKey);
      
      this.logger.debug(`Client connected: ${client.id} for user ${userId}`);
      
      // Send unread count
      const unreadCount = await this.notificationService.getUnreadCount(userId, tenantId);
      client.emit('unread-count', { count: unreadCount });
    } catch (error) {
      this.logger.error('Error in WebSocket connection:', error);
      client.disconnect();
    }
  }
  
  // Handle client disconnection
  handleDisconnect(client: Socket): void {
    // Remove socket from user mapping
    for (const [userKey, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        
        // Clean up empty sets
        if (sockets.size === 0) {
          this.userSockets.delete(userKey);
        }
        
        this.logger.debug(`Client disconnected: ${client.id}`);
        break;
      }
    }
  }
  
  // Send notification to specific user
  sendNotificationToUser(userId: string, tenantId: string, notification: any): void {
    const userKey = `${tenantId}:${userId}`;
    
    // Send to all user's connected sockets
    this.server.to(userKey).emit('notification', notification);
    
    this.logger.debug(`Sent notification to user ${userId}: ${notification.id}`);
  }
  
  // Handle mark as read event from client
  @SubscribeMessage('mark-read')
  async handleMarkRead(client: Socket, data: { id: string }): Promise<void> {
    try {
      // Extract user info from socket
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      // Mark notification as read
      const success = await this.notificationService.markAsRead(data.id, userId);
      
      if (success) {
        // Send updated unread count
        const unreadCount = await this.notificationService.getUnreadCount(userId, payload.tenantId);
        client.emit('unread-count', { count: unreadCount });
      }
    } catch (error) {
      this.logger.error(`Error marking notification as read: ${data.id}`, error);
    }
  }
}
