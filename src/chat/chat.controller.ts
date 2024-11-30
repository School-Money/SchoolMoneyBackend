import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('/private')
    async getMessages(@Query() query: PrivateChatRoomGetMessages, @Req() req) {
        const { id: userId } = req.user;
        const { receiverId } = query;
        return await this.chatService.getPrivateMessages(userId, receiverId);
    }

    @Post('/private')
    async sendMessage(@Query() query: PrivateChatRoomGetMessages, @Req() req) {
        const { id: userId } = req.user;
        const { receiverId } = query;
        return await this.chatService.sendMessage(userId, receiverId);
    }
}
