export interface UserDto {
    id: number;
    lastName: string;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    roleName: RoleType;
}


export enum RoleType {
    'administrador/a' = 'admin',
    'cobrador/a' = 'debt-collector'
}