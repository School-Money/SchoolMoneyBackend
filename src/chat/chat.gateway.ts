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

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.activeUsers.delete(client.id);
        this.clientRooms.delete(client.id);
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('joinRoomPrivate')
    async handleJoinRoomPrivate(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { receiverId: string },
        @Req() req,
    ) {
        const userId = req.user.id;
        console.log(`Client ${client.id} is joining room with user ${userId}`);
        const chatRoom = await this.chatService.getPrivateMessages(userId, payload.receiverId);
        const roomId = chatRoom._id.toHexString();
        client.join(roomId);
        this.clientRooms.set(client.id, roomId);
        this.activeUsers.set(client.id, userId);
        console.log(`Client ${client.id} joined room ${roomId}`);
        this.server.to(roomId).emit('receiveMessage', chatRoom.messages);
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('sendMessagePrivate')
    async handleSendMessagePrivate(
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

    @UseGuards(AuthGuard)
    @SubscribeMessage('joinRoomClass')
    async handleJoinRoomClass(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { classId: string },
        @Req() req,
    ) {
        const userId = req.user.id;
        const chatRoom = await this.chatService.getClassMessages(userId, payload.classId);
        const roomId = chatRoom._id.toHexString();
        client.join(roomId);
        this.clientRooms.set(client.id, roomId);
        this.activeUsers.set(client.id, userId);
        console.log(`Client ${client.id} joined room ${roomId}`);
        this.server.to(roomId).emit('receiveMessage', chatRoom.messages);
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('sendMessageClass')
    async handleSendMessageClass(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { classId: string; content: string },
        @Req() req,
    ) {
        const userId = req.user.id;
        const roomId = this.clientRooms.get(client.id);

        if (!roomId) {
            console.error(`Client ${client.id} is not in any room!`);
            return;
        }

        const { classId, content } = payload;
        const chatRoom = await this.chatService.sendClassMessage(userId, classId, content);
        this.server.to(roomId).emit('receiveMessage', chatRoom.messages);
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('joinRoomHelpdesk')
    async handleJoinRoomHelpdesk(@ConnectedSocket() client: Socket, @Req() req) {
        const userId = req.user.id;
        const chatRoom = await this.chatService.getAdminMessages(userId);
        const roomId = chatRoom._id.toHexString();
        client.join(roomId);
        this.clientRooms.set(client.id, roomId);
        this.activeUsers.set(client.id, userId);
        this.server.to(roomId).emit('receiveMessage', chatRoom.messages);
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('sendMessageHelpdesk')
    async handleSendMessageHelpdesk(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { content: string },
        @Req() req,
    ) {
        const userId = req.user.id;
        const roomId = this.clientRooms.get(client.id);

        if (!roomId) {
            console.error(`Client ${client.id} is not in any room!`);
            return;
        }

        const { content } = payload;
        const chatRoom = await this.chatService.sendAdminMessage(userId, content);

        this.server.to(roomId).emit('receiveMessage', chatRoom.messages);
    }
}
