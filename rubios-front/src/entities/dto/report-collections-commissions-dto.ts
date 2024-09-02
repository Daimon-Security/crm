import { DetailCollectionDto } from "./collections-detail-dto";

export interface ReportCollectionsCommissionsDto{
    debtCollectorId: string;
    debtCollectorName: string;
    userRole: string;
    startDate: Date;
    endDate: Date;
    detailsReport: DetailCollectionDto[];
}