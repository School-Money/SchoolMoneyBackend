import { Types } from 'mongoose';
import { Child } from 'src/schemas/Child.schema';
import { Collection } from 'src/schemas/Collection.schema';
import { Parent } from 'src/schemas/Parent.schema';

export interface PaymentCreatePayload {
    collectionId: string;
    childId: string | null;
    amount: number;
}

export interface WithdrawPaymentPayload {
    paymentId: string;
}

export interface CreatePaymentDto {
    _id: Types.ObjectId;
    collection: Types.ObjectId;
    parent: Types.ObjectId;
    child: Types.ObjectId | null;
    amount: number;
    description: string;
    createdAt: Date;
    withdrawn: boolean;
}

export interface PaymentDto {
    _id: Types.ObjectId;
    collection: Collection;
    parent: Parent;
    child: Child | null;
    amount: number;
    description: string;
    createdAt: Date;
}

export interface PaymentDtoMadeByParent {
    _id: Types.ObjectId;
    collection: Collection;
    child: Child | null;
    amount: number;
    description: string;
    createdAt: Date;
}
