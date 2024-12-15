import { Body, Controller, Get, Post, Query, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChatMessageSend, ClassChatRoomRequest, PrivateChatRoomRequest } from 'src/interfaces/chat.interface';
import { ClassService } from 'src/class/class.service';

/**
 * This is a not preffered way of chat, as @see ChatGateway is a better way to implement chat, left for zadyma purposes
 **/
@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly classService: ClassService,
    ) {}

    @Get('/private')
    async getPrivateMessages(@Query() query: PrivateChatRoomRequest, @Req() req) {
        const { id: userId } = req.user;
        const { receiverId } = query;
        return await this.chatService.getPrivateMessages(userId, receiverId);
    }

    @Post('/private')
    async sendPrivateMessage(@Query() query: PrivateChatRoomRequest, @Body() payload: ChatMessageSend, @Req() req) {
        const { id: userId } = req.user;
        const { receiverId } = query;
        const { content } = payload;
        return await this.chatService.sendPrivateMessage(userId, receiverId, content);
    }

    @Get('/helpdesk')
    async getHelpdeskMessages(@Req() req) {
        const { id: userId } = req.user;
        return await this.chatService.getAdminMessages(userId);
    }

    @Post('/helpdesk')
    async sendHelpdeskMessage(@Body() payload: ChatMessageSend, @Req() req) {
        const { id: userId } = req.user;
        const { content } = payload;
        return await this.chatService.sendAdminMessage(userId, content);
    }

    @Get('/class')
    async getClassMessages(@Query() query: ClassChatRoomRequest, @Req() req) {
        const { id: userId } = req.user;
        const { classId } = query;
        if (!(await this.classService.isParentInClass(userId, classId))) {
            throw new UnauthorizedException('You are not in this class');
        }
        return await this.chatService.getClassMessages(userId, classId);
    }

    @Post('/class')
    async sendClassMessage(@Query() query: ClassChatRoomRequest, @Body() payload: ChatMessageSend, @Req() req) {
        const { id: userId } = req.user;
        const { classId } = query;
        const { content } = payload;
        if (!(await this.classService.isParentInClass(userId, classId))) {
            throw new UnauthorizedException('You are not in this class');
        }
        return await this.chatService.sendClassMessage(userId, classId, content);
    }
}
