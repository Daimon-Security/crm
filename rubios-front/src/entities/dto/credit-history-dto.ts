export interface CreditHistory{
    id: number;
    date: Date;
    firstPayment: Date;
    principal: number;
    interest: number;
    payDay: string;
    status: string;
    balance: number
}