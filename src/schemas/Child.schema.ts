import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId } from "mongoose";

export type ChildDocument = HydratedDocument<Child>;

@Schema()
export class Child {
    @Prop({
        required: true,
        ref: "Parent",
    })
    parent: ObjectId;

    @Prop({
        required: true,
        ref: "Class",
    })
    class: ObjectId;

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
    })
    birthDate: Date;

    @Prop({
        required: true,
    })
    avatar: string;

    @Prop({
        default: Date.now(),
    })
    createdAt: Date;
}

export const ChildSchema = SchemaFactory.createForClass(Child);
