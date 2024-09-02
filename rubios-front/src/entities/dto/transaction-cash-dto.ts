export interface TransactionCashDto {
    id: number;
    date: string;
    user: string;
    concept: string;
    type: TransactionType;
    currencyType: string;
    amount: number
}

export enum TransactionType{
    'Pago de cuota' = 1,
    'Pago de interés' = 2,
    'Ingreso' = 3,
    'Egreso' = 4,
    'Venta-Contado' = 5,
    'Venta-Anticipo' = 6,
    'Cancelación pago de cuota' = 7,
    'Cancelación pago de interés' = 8,
    'Crédito' = 9,
    'Comisión' = 10
}