export interface ChildCreate extends ChildCreateDetails {
    parentId: string;
}

export interface ChildUpdate extends ChildUpdateDetails {
    parentId: string;
}

export interface ChildUpdateDetails {
    childId: string;
    classId: string;
    firstName?: string;
    lastName?: string;
    //unix timestamp
    birthDate?: number;
    avatar?: string;
}

export interface ChildCreateDetails {
    inviteCode: string;
    firstName: string;
    lastName: string;
    //unix timestamp
    birthDate?: number;
}
