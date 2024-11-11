export interface CollectionPayload {
    title: string;
    description: string;
    logo: string;
    startDate: number;
    endDate: number;
    targetAmount: number;
    classId: string;
}

export interface CollectionUpdate extends CollectionPayload {
    collectionId: string;
}
