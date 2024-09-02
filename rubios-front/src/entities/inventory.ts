export interface Inventory{
    id: number;
    date: string;
    amount: number;
    costPesos: number;
    costDollar: number;
    concept:number;
}

export enum OperationStock{
    'compra' = 1,
    'venta' = 2,
    'devolución' = 3,
    'cancelación de venta' = 4,
    'ajuste de stock' = 5
}