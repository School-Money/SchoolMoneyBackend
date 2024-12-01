import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/schemas/Admin.schema';
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
        @InjectModel(Admin.name)
        private readonly adminModel: Model<Admin>,
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

    async sendPrivateMessage(userId: string, receiverId: string, content: string) {
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
            content,
            createdAt: new Date(),
        });
        await chatRoom.save();
        return chatRoom;
    }

    async getAdminMessages(userId: string) {
        const user = await this.parentModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const admin = await this.adminModel.findOne();
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        let chatRoom = await this.privateChatRoomModel.findOne({
            participants: { $all: [userId, admin._id] },
        });
        if (!chatRoom) {
            chatRoom = await this.privateChatRoomModel.create({
                participants: [userId, admin._id],
                messages: [],
            });
        }
        return chatRoom;
    }

    async sendAdminMessage(userId: string, content: string) {
        const user = await this.parentModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const admin = await this.adminModel.findOne();
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        let chatRoom = await this.privateChatRoomModel.findOne({
            participants: { $all: [userId, admin._id] },
        });
        if (!chatRoom) {
            chatRoom = await this.privateChatRoomModel.create({
                participants: [userId, admin._id],
                messages: [],
            });
        }
        chatRoom.messages.push({
            sender: user._id,
            content,
            createdAt: new Date(),
        });
        await chatRoom.save();
        return chatRoom;
    }

    async getClassMessages(userId: string, classId: string) {
        const user = await this.parentModel.findById(userId);
        const classDoc = await this.classModel.findById(classId);
        if (!user || !classDoc) {
            throw new NotFoundException('User or class not found');
        }

        let chatRoom = await this.classChatRoomModel.findOne({
            class: classId,
        });
        if (!chatRoom) {
            chatRoom = await this.classChatRoomModel.create({
                class: classDoc._id,
                messages: [],
            });
        }
        return chatRoom;
    }

    async sendClassMessage(userId: string, classId: string, content: string) {
        const user = await this.parentModel.findById(userId);
        const classDoc = await this.classModel.findById(classId);
        if (!user || !classDoc) {
            throw new NotFoundException('User or class not found');
        }

        let chatRoom = await this.classChatRoomModel.findOne({
            class: classId,
        });
        if (!chatRoom) {
            chatRoom = await this.classChatRoomModel.create({
                class: classDoc._id,
                messages: [],
            });
        }
        chatRoom.messages.push({
            sender: user._id,
            content,
            createdAt: new Date(),
        });
        await chatRoom.save();
        return chatRoom;
    }
}
