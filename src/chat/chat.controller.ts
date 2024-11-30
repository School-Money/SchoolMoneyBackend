import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get('/private/create')
    async getMessages(@Body() payload: PrivateChatRoomGetMessages, @Req() req) {
        const { id: userId } = req.user;
        const { receiverId } = payload;
        return await this.chatService.getPrivateMessages(userId, receiverId);
    }

    @Post('/send')
    async sendMessage() {
        return await this.chatService.sendMessage();
    }
}
