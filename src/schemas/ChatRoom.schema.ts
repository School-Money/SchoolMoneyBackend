import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
  @Prop({
    required: true,
    type: String,
    enum: ['class', 'private'],
  })
  type: string;

  @Prop({
    type: Types.ObjectId,
  })
  participants: Types.ObjectId[];

  @Prop({
    type: {
      sender: Types.ObjectId,
      content: String,
      createdAt: Date,
    },
  })
  messages: {
    sender: Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];

  @Prop({
    default: Date.now(),
  })
  createdAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
