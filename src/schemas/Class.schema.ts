import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ClassDocument = HydratedDocument<Class>;

@Schema()
export class Class {
    @Prop({
        required: true,
        minlength: 2,
        maxlength: 30,
    })
    name: string;

    @Prop({
        required: true,
        ref: 'Parent',
        type: Types.ObjectId,
    })
    treasurer: Types.ObjectId;

    @Prop({
        default: Date.now(),
    })
    createdAt: Date;
}

export const ClassSchema = SchemaFactory.createForClass(Class);
