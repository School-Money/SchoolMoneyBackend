export interface ParentRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    repeatPassword: string;
}

export interface ParentLogin {
    email: string;
    password: string;
}
