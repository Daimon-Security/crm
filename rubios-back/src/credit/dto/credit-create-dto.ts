import { IsArray, IsDate, IsDateString, IsNumber, IsString } from 'class-validator';
import { PaymentDetailCreateDto } from './payment-detaill-create-dto';


export class CreditCreateDto{
    @IsNumber()
    readonly clientId: number;

    @IsNumber()
    readonly debtCollectorId: number;

    
    @IsString()
    readonly date: string;

    @IsString()
    readonly firstPayment: string;

    @IsNumber()
    readonly principal: number;

    @IsNumber()
    readonly interestRate: number;

    @IsString()
    readonly paymentFrequency: string;

    @IsNumber()
    readonly numberPayment: number;

    @IsNumber()
    readonly payment: number;

    @IsString()
    readonly information: string;

    @IsString()
    readonly typeCurrency: string;

    @IsNumber()
    readonly commission: number;

    @IsNumber()
    readonly balance: number;

    @IsArray()
    paymentsDetail: PaymentDetailCreateDto[]
}