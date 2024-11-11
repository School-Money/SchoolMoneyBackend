export interface ChildCreate extends ChildDetails {
  parentId: string;
}

export interface ChildUpdate extends Partial<ChildDetails> {
  parentId: string;
  childId: string;
}

export interface ChildDetails {
  classId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  avatar: string;
}
