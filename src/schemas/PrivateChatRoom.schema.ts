import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseChatRoom } from './BaseChatRoom.schema';

export type ChatRoomDocument = HydratedDocument<BaseChatRoom>;

@Schema()
export class PrivateChatRoom extends BaseChatRoom {
    @Prop({
        required: true,
        type: [Types.ObjectId],
    })
    participants: Types.ObjectId[];
}

export const PrivateChatRoomSchema = SchemaFactory.createForClass(PrivateChatRoom);
