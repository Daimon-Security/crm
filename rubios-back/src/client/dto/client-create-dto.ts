import { IsNumber, IsNumberString, IsString } from "class-validator";

export class ClientCreateDto{
    
    @IsString()
    lastName: string;

    @IsString()
    name: string;

    @IsString()
    address: string;

    @IsString()
    phoneNumber: string;
  
    @IsString()
    clientNumber: string;

    @IsNumber()
    type: number;
}


export enum ClientType{
    'credit' = 1,
    'sale' = 2,
    'credit-sale' = 3
}