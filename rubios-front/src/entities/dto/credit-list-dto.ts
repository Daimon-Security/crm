export interface CreditListDto {
    id: number;
    client: string;
    clientId: number;
    clientNumber: number;
    debtCollector: string;
    debtCollectorId: number;
    date: string;
    firstPayment: string;
    principal: number;
    interestRate: number;
    paymentFrequency: string;
    numberPayment: number;
    payment: number;
    payDay: string;
    information: string;
    typeCurrency: string;
    status: string;
    commission: number;
    type?: number
}