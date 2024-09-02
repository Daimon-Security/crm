import { PaymentDetailCreateDto } from "./payment-detail-create-dto";

export interface SaleCreditCreateDto{
    clientId: number,
    debtCollectorId: number,
    date: string,
    firstPayment: string,
    principal: number,
    payment: number,
    numberPayment: number,
    interestRate: number,
    paymentFrequency: string,
    commission: number;
    paymentsDetail: PaymentDetailCreateDto[];
    balance: number;
    typeCurrency: string;
    downPayment: number
}