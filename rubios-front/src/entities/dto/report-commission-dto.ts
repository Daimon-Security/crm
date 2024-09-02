import { DetailCollectionDto } from "./collections-detail-dto";
export interface ReportCommissionsDto{
    debtCollectorId: string;
    debtCollectorName: string;
    detailsReport: DetailCollectionDto[];
}