export interface Client {
    id: number,
    lastName: string,
    name: string,
    address: string,
    phoneNumber: string;
    clientNumber: number;
    type: ClientType
}

export enum ClientType{
    'Crédito' = 1,
    'Venta' = 2,
    // 'Crédito-Venta' = 3
}