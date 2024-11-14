import { Types } from "mongoose";
import { Child } from "src/schemas/Child.schema";
import { Collection } from "src/schemas/Collection.schema";
import { Parent } from "src/schemas/Parent.schema";

export interface PaymentCreatePayload {
    collectionId: string;
    childId: string;
    amount: number;
}

export interface WithdrawPaymentPayload {
    paymentId: string;
}

export interface PaymentDto {
    _id: Types.ObjectId;
    collection: Collection;
    parent: Parent;
    child: Child;
    amount: number;
    description: string;
    createdAt: Date;
}

export interface PaymentDtoMadeByParent {
    _id: Types.ObjectId;
    collection: Collection;
    child: Child;
    amount: number;
    description: string;
    createdAt: Date;
}