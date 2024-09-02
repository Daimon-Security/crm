export interface ProductCreateDto{
    code: string;
    name: string;
    categoryId: number;
    description: string;
    stock: string;
    costPesos: number;
    costDollar: number;
    pricePesos: number;
    priceDollar: number;
}