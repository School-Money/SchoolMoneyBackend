export interface ClassDetails {
    name: string;
}

export interface ClassCreate extends ClassDetails {
    treasurerId: string;
}

export interface PassTreasurerToParentPayload {
    newTreasurerId: string,
    classId: string
}

export interface PassTreasurerToParentParams extends PassTreasurerToParentPayload {
    currentTreasurerId: string,
}
