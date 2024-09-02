export interface TotalChargeAccountedAndCollectedDto {
    debtCollectorId: number;
    debtCollectorName: string;
    totalPaymentsReceivablesPesos: number;
    totalPaymentsReceivablesDollar: number;
    totalPaymentsCollectedPesos: number;
    totalPaymentsCollectedDollar: number;
}