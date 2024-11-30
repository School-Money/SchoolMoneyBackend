import { Injectable } from '@nestjs/common';
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

    async createPrivateChat() {
        const chatRoom = this.privateChatRoomModel.create({});
    }

    async sendMessage() {
        return 'Message sent';
    }
}
