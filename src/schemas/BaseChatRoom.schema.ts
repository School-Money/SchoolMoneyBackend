import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<BaseChatRoom>;

@Schema()
export class BaseChatRoom {
    @Prop({
        type: [
            {
                sender: Types.ObjectId,
                content: String,
                createdAt: Date,
            },
        ],
    })
    messages: {
        sender: Types.ObjectId;
        content: string;
        createdAt: Date;
    }[];

    @Prop({
        default: Date.now,
    })
    createdAt: Date;
}

export const BaseChatRoomSchema = SchemaFactory.createForClass(BaseChatRoom);
