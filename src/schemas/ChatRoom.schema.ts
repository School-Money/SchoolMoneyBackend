import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId } from "mongoose";

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema()
export class ChatRoom {
    @Prop({
        required: true,
        type: String,
        enum: ["class", "private"],
    })
    type: string;

    @Prop()
    participants: ObjectId[];

    @Prop()
    messages: {
        sender: ObjectId;
        content: string;
        createdAt: Date;
    }[];

    @Prop({
        default: Date.now(),
    })
    createdAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
