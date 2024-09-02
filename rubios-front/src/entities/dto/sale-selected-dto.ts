import { SaleDetailDto } from './sale-detail-dto';


export interface SaleSelectedDto {
    id: number;
    clientId: number;
    total: number;
    payment: number;
    date: string;
    saleDetails: SaleDetailDto[];
}