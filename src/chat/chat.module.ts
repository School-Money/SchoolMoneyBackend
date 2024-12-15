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

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
        MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
        MongooseModule.forFeature([{ name: Child.name, schema: ChildSchema }]),
        MongooseModule.forFeature([{ name: ClassChatRoom.name, schema: ClassChatRoomSchema }]),
        MongooseModule.forFeature([{ name: PrivateChatRoom.name, schema: PrivateChatRoomSchema }]),
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
        MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }]),
    ],
    controllers: [ChatController],
    providers: [ChatService, ClassService, ChatGateway],
})
export class ChatModule {}
