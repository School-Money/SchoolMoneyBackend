import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ParentDocument = HydratedDocument<Parent>;

@Schema()
export class Parent {
    @Prop({
        required: true,
        minlength: 2,
        maxlength: 30,
    })
    firstName: string;

    @Prop({
        required: true,
        minlength: 2,
        maxlength: 30,
    })
    lastName: string;

    @Prop({
        required: true,
        minlength: 8,
        maxlength: 30,
    })
    password: string;

    @Prop({
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50,
    })
    email: string;

    @Prop({
        default: "avatar.jpg",
    })
    avatar: string;

    @Prop({
        default: Date.now(),
    })
    createdAt: Date;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
