import { Class } from 'src/schemas/Class.schema';
import { Collection } from 'src/schemas/Collection.schema';
import { Parent } from 'src/schemas/Parent.schema';
import { Payment } from 'src/schemas/Payment.schema';

export interface CollectionPayload {
    title: string;
    description: string;
    logo: string;
    // Unix timestamp in milliseconds
    startDate: number;
    // Unix timestamp in milliseconds
    endDate: number;
    targetAmount: number;
    classId: string;
}

export interface CollectionUpdate extends CollectionPayload {
    collectionId: string;
}

export interface CollectionsDto extends Collection {
    currentAmount: number;
}

export interface GetCollectionDetailsPayment extends Payment {
    withdrawable: boolean;
}

export interface GetCollectionDetails {
    _id: string;
    class: Class;
    payments: GetCollectionDetailsPayment[];
    creator: Parent;
    title: string;
    description: string;
    logo: string;
    startDate: Date;
    endDate: Date;
    targetAmount: number;
    currentAmount: number;
    isBlocked: boolean;
}
