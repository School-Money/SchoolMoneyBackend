import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { PrivateChatRoom, PrivateChatRoomSchema } from 'src/schemas/PrivateChatRoom.schema';
import { ClassChatRoom, ClassChatRoomSchema } from 'src/schemas/ClassChatRoom.schema';
import { Admin, AdminSchema } from 'src/schemas/Admin.schema';
import { ClassService } from 'src/class/class.service';
import { Child, ChildSchema } from 'src/schemas/Child.schema';
import { ChatGateway } from './chat.gateway';
import { CollectionSchema, Collection } from 'src/schemas/Collection.schema';
import { ParentModule } from 'src/parent/parent.module';
import { BankAccount, BankAccountSchema } from 'src/schemas/BankAccount.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Class.name, schema: ClassSchema },
            { name: Parent.name, schema: ParentSchema },
            { name: Child.name, schema: ChildSchema },
            { name: PrivateChatRoom.name, schema: PrivateChatRoomSchema },
            { name: ClassChatRoom.name, schema: ClassChatRoomSchema },
            { name: Admin.name, schema: AdminSchema },
            { name: Collection.name, schema: CollectionSchema },
            { name: BankAccount.name, schema: BankAccountSchema },
        ]),
        ParentModule,
    ],
    controllers: [ChatController],
    providers: [ChatService, ClassService, ChatGateway],
})
export class ChatModule {}
