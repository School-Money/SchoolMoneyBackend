import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChildDocument = HydratedDocument<Child>;

@Schema()
export class Child {
    @Prop({
        required: true,
        ref: 'Parent',
        type: Types.ObjectId,
    })
    parent: Types.ObjectId;

    @Prop({
        required: true,
        ref: 'Class',
        type: Types.ObjectId,
    })
    class: Types.ObjectId;

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
        default: null,
    })
    avatar: string | null;

    @Prop({
        default: Date.now(),
    })
    createdAt: Date;
}

export const ChildSchema = SchemaFactory.createForClass(Child);
