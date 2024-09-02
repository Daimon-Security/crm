import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES } from "react";

export interface ProductListDto{
    id: string;
    code: string;
    name: string;
    description: string;
    category: string;
    categoryId: number;
    pricePesos: number;
    priceDollar: number;
    stock: number;
    [key: string]: any;
}