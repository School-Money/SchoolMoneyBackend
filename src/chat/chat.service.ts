import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Collection, Model } from 'mongoose';
import { BankAccount } from 'src/schemas/BankAccount.schema';
import { Child } from 'src/schemas/Child.schema';
import { Class } from 'src/schemas/Class.schema';
import { ClassChatRoom } from 'src/schemas/ClassChatRoom.schema';
import { Parent } from 'src/schemas/Parent.schema';
import { Payment } from 'src/schemas/Payment.schema';
import { PrivateChatRoom } from 'src/schemas/PrivateChatRoom.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Collection.name)
        private readonly collectionModel: Model<Collection>,
        @InjectModel(Parent.name)
        private readonly parentModel: Model<Parent>,
        @InjectModel(Class.name)
        private readonly classModel: Model<Class>,
        @InjectModel(Child.name)
        private readonly childModel: Model<Child>,
        @InjectModel(BankAccount.name)
        private readonly bankAccountModel: Model<BankAccount>,
        @InjectModel(Payment.name)
        private readonly paymentModel: Model<Payment>,
        @InjectModel(PrivateChatRoom.name)
        private readonly privateChatRoomModel: Model<PrivateChatRoom>,
        @InjectModel(ClassChatRoom.name)
        private readonly classChatRoomModel: Model<ClassChatRoom>,
    ) {}

    async getPrivateMessages(userId: string, receiverId: string) {
        // First, we need to check if the users exist
        const user = await this.parentModel.findById(userId);
        const receiver = await this.parentModel.findById(receiverId);
        if (!user || !receiver) {
            throw new NotFoundException('User not found');
        }

        // Then, we need to check if they have a chat room
        const chatRoom = await this.privateChatRoomModel.findOne({
            participants: { $all: [userId, receiverId] },
        });
    }

    async sendMessage() {
        return 'Message sent';
    }
}
