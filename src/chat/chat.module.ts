import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Class, ClassSchema } from 'src/schemas/Class.schema';
import { Parent, ParentSchema } from 'src/schemas/Parent.schema';
import { PrivateChatRoom, PrivateChatRoomSchema } from 'src/schemas/PrivateChatRoom.schema';
import { ClassChatRoom, ClassChatRoomSchema } from 'src/schemas/ClassChatRoom.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
        MongooseModule.forFeature([{ name: Parent.name, schema: ParentSchema }]),
        MongooseModule.forFeature([{ name: ClassChatRoom.name, schema: ClassChatRoomSchema }]),
        MongooseModule.forFeature([{ name: PrivateChatRoom.name, schema: PrivateChatRoomSchema }]),
    ],
    controllers: [ChatController],
    providers: [ChatService],
})
export class ChatModule {}
