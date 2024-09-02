export interface SaleCreditListDto {
    id: number;
    client: string;
    clientId: number;
    clientNumber: number;
    debtCollector: string;
    debtCollectorId: number;
    date: string;
    firstPayment: string;
    principal: number;
    paymentFrequency: string;
    numberPayment: number;
    payment: number;
    payDay: string;
    //typeCurrency: string;
}