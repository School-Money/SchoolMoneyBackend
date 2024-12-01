import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@WebSocketGateway({
    namespace: 'chat',
    cors: {
        origin: '*', // Adjust in production to allow only specific domains
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly chatService: ChatService) {}

    @WebSocketServer()
    server: Server;

    private activeUsers = new Map<string, string>(); // Map of socketId -> userId
    private clientRooms = new Map<string, string>(); // Map of socketId -> roomId

    async handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.activeUsers.delete(client.id);
        this.clientRooms.delete(client.id);
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('joinRoomPrivate')
    async handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { receiverId: string },
        @Req() req,
    ) {
        const userId = req.user.id;
        const chatRoom = await this.chatService.getPrivateMessages(userId, payload.receiverId);
        const roomId = chatRoom._id.toHexString();
        client.join(roomId);
        this.clientRooms.set(client.id, roomId);
        this.activeUsers.set(client.id, userId);
        console.log(`Client ${client.id} joined room ${roomId}`);
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('sendMessagePrivate')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { receiverId: string; content: string },
        @Req() req,
    ) {
        const userId = req.user.id;
        const roomId = this.clientRooms.get(client.id);

        if (!roomId) {
            console.error(`Client ${client.id} is not in any room!`);
            return;
        }

        const { receiverId, content } = payload;
        const chatRoom = await this.chatService.sendPrivateMessage(userId, receiverId, content);

        this.server.to(roomId).emit('receiveMessage', chatRoom.messages);
    }
}
