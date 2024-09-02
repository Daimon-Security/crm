import { SaleDetailDto } from "./sale-detail-dto";

export interface SaleDto {
    id: number;
    date: string;
    clientId: number;
    clientName: string;
    total: number;
    payment: number;
    paymentType: string;
    saleDetails: SaleDetailDto[];
    status: SaleStatus;
    currencyType: string;
    creditId: number;
}

export enum SaleStatus{
    'valid' = 1,
    'cancelled' = 2
}