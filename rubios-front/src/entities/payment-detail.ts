export interface PaymentDetail{
    id: number;
    paymentDueDate: string;
    paymentDate: string;
    payment: number;
    actualPayment: number;
    balance:number;
    paymentType: string;
    number: string
}