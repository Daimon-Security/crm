export interface SaleDetailCreateDto {
    code: number;
    productId: number;
    productName: string | undefined;
    quantity: number;
    price: number;
    total: number
}