import { Collection } from "src/schemas/Collection.schema";

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
