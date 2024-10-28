import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
    @Prop({
        required: true,
        ref: "Collection",
    })
    collection: string;

    @Prop({
        required: true,
        ref: "Parent",
    })
    parent: string;

    @Prop({
        required: true,
        ref: "Child",
    })
    child: string;

    @Prop({
        required: true,
    })
    amount: number;

    @Prop({
        required: true,
    })
    createdAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
