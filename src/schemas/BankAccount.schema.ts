import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId } from "mongoose";

export type BankAccountDocument = HydratedDocument<BankAccount>;

@Schema()
export class BankAccount {
    @Prop({
        required: true,
        length: 16,
    })
    accountNumber: string;

    @Prop({
        default: 0,
    })
    balance: number;

    @Prop({
        ref: "User",
        required: true,
    })
    owner: ObjectId;
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);
