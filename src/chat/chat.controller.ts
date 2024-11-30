import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('/private/create')
    async createPrivateChat(@Body() payload: PrivateChatRoomCreate, @Req() req) {
        return await this.chatService.createPrivateChat();
    }

    @Post('/send')
    async sendMessage() {
        return await this.chatService.sendMessage();
    }
}
