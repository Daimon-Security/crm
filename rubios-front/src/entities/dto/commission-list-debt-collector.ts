import { CommissionCreditDto } from "./commission-credit-dto";

export interface CommissionListDebtCollector{
    debtCollectorId: number;
    debtCollectorName: string;
    creditsDetailCommission: CommissionCreditDto[]
}