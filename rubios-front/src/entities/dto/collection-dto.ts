export interface CollectionDto{
    id: number;
    debtCollector: string;
    client: string;
    clientNumber: number;
    informationClient: InformationClient;
    paymentDueDate: string;
    paymentDate: string;
    payment: number;
    actualPayment: number;
    balance: number;
    typeCurrency: string;
    principal: number;
    interest: number;
    paymentType: string;
    statusCreditHistory: string;
    numberPayment: number;
    creditId: number;
    number: string;
    detail?: string;
    date: string

}

interface InformationClient {
    phoneNumber: string;
    address: string;
    paymentInformation: string;
    email: string;
}