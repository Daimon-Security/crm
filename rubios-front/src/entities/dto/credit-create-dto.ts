import { PaymentDetailCreateDto } from './payment-detail-create-dto';
export interface CreditCreateDto{
    clientId: number,
    debtCollectorId: number,
    date: string,
    firstPayment: string,
    principal: number,
    payment: number,
    numberPayment: number,
    interestRate: number,
    paymentFrequency: string,
    information: string,
    typeCurrency: string,
    commission: number
    paymentsDetail: PaymentDetailCreateDto[],
    balance: number


}