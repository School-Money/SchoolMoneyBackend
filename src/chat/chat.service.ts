import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class } from 'src/schemas/Class.schema';
import { ClassChatRoom } from 'src/schemas/ClassChatRoom.schema';
import { Parent } from 'src/schemas/Parent.schema';
import { PrivateChatRoom } from 'src/schemas/PrivateChatRoom.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Parent.name)
        private readonly parentModel: Model<Parent>,
        @InjectModel(Class.name)
        private readonly classModel: Model<Class>,
        @InjectModel(PrivateChatRoom.name)
        private readonly privateChatRoomModel: Model<PrivateChatRoom>,
        @InjectModel(ClassChatRoom.name)
        private readonly classChatRoomModel: Model<ClassChatRoom>,
    ) {}

    async getPrivateMessages(userId: string, receiverId: string) {
        const user = await this.parentModel.findById(userId);
        const receiver = await this.parentModel.findById(receiverId);
        if (!user || !receiver) {
            throw new NotFoundException('User not found');
        }

        let chatRoom = await this.privateChatRoomModel.findOne({
            participants: { $all: [userId, receiverId] },
        });
        if (!chatRoom) {
            chatRoom = await this.privateChatRoomModel.create({
                participants: [userId, receiverId],
                messages: [],
            });
        }
        return chatRoom;
    }

    async sendMessage(userId: string, receiverId: string) {
        const user = await this.parentModel.findById(userId);
        const receiver = await this.parentModel.findById(receiverId);
        if (!user || !receiver) {
            throw new NotFoundException('User not found');
        }

        let chatRoom = await this.privateChatRoomModel.findOne({
            participants: { $all: [userId, receiverId] },
        });
        if (!chatRoom) {
            chatRoom = await this.privateChatRoomModel.create({
                participants: [userId, receiverId],
                messages: [],
            });
        }
        chatRoom.messages.push({
            sender: user._id,
            content: 'Hello, how are you?',
            createdAt: new Date(),
        });
        await chatRoom.save();
        return chatRoom;
    }
}
