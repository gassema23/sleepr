export interface User {
    id: string;
    email: string;
    password: string;
    roles?: string[];
}