import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
    @Prop({
        required: true,
        ref: 'Collection',
        type: Types.ObjectId,
    })
    collection: Types.ObjectId;

    @Prop({
        required: true,
        ref: 'Parent',
        type: Types.ObjectId,
    })
    parent: Types.ObjectId;

    @Prop({
        required: true,
        ref: 'Child',
        type: Types.ObjectId,
    })
    child: Types.ObjectId;

    @Prop({
        required: true,
    })
    amount: number;

    @Prop({
        required: true,
    })
    description: string;

    @Prop({
        required: true,
        default: Date.now(),
    })
    createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
