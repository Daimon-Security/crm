import { SaleDetailCreateDto } from "./sale-detail-create-dto";

export interface SaleCreateDto{
    clientId: number;
    date: string;
    total: number;
    payment: number;
    paymentType: string;
    saleDetails: SaleDetailCreateDto[];
    typeCurrency: string;

}