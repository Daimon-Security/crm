import { CreditHistory } from "./credit-history-dto";

export interface CreditDetailDto{
    id: number;
    client: string;
    clientNumber: number;
    debtCollector: string;
    interestRate: number;
    paymentFrequency: string;
    numberPayment: number;
    information: string;
    typeCurrency: string;
    status: string;
    creditHistory: CreditHistory[]
}