export interface ClassDetails {
    name: string;
}

export interface ClassCreate extends ClassDetails {
    treasurerId: string;
}

export interface PassTreasurerToParentPayload {
    newTreasurerId: string;
    classId: string;
}

export interface PassTreasurerToParentParams extends PassTreasurerToParentPayload {
    currentTreasurerId: string;
}

export interface GetClassInviteCodePayload {
    classId: string;
}

export interface GetClassDetailsPayload {
    classId: string;
}
