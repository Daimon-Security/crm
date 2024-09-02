export interface CreditTransactionDto{
    id: number;
    date: string;
    concept: string;
    currencyType: string;
    creditId: number;
    amount: number;
}