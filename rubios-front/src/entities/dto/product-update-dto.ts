export interface ProductUpdateDto{
    code: string;
    name: string;
    categoryId: number;
    description: string;
    pricePesos: number;
    priceDollar: number;
}