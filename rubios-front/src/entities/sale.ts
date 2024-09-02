import { SaleDetail } from "./sale-detail";

export interface Sale{
    id: number;
    clientId: number;
    date: string;
    paymentType: number;
    total: number;
    payment: number;
    saleDetails: SaleDetail[]
}