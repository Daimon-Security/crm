export interface PaymentDetailCreateDto{
    payment: number;
    paymentDueDate: any;
    paymentDate: any | null;
    status:StatusPayment
};

export enum StatusPayment{
    'active' = 1,
    'cancelled'= 2
}