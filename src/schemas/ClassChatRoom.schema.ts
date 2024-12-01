import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseChatRoom } from './BaseChatRoom.schema';

export type ChatRoomDocument = HydratedDocument<BaseChatRoom>;

@Schema()
export class ClassChatRoom extends BaseChatRoom {
    @Prop({
        required: true,
        type: Types.ObjectId,
    })
    class: Types.ObjectId;
}

export const ClassChatRoomSchema = SchemaFactory.createForClass(ClassChatRoom);
