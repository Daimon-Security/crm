export interface Credit {
    id: any,
    clientId: number,
    debtCollectorId: number,
    date: string,
    firstPayment: string,
    principal: number,
    status: StatusCredit,
    numberPayment: number,
    interestRate: number,
    payment: number,
    paymentFrequency: string,
    information: string,
    action?: any

}


export enum StatusCredit{
    active = 1,
    canceled = 2,
    delinquent = 3,
    bad = 4
}


// export enum PaymentFrequency{
//     weekly = "Semanal",
//     monthly = "Mensual"
// }