export interface CommissionCreditDto{
    creditHistoryId: number;
    debtCollector: string;
    client: string;
    date: string;
    principal: number;
    interest: number;
    rateCommission: number;
    commission: number;
    typeCurrency: string;
    commissionPaymentDate: string
}