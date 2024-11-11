export interface ChildCreate extends Omit<ChildDetails, 'classId'> {
  parentId: string;
  classId: string;
}

export interface ChildDetails {
  classId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  avatar: string;
}
