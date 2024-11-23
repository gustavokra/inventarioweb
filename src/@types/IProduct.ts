import { ISupplier } from "./ISupplier";

export interface IProduct {
    id?: number;
    image: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    supplier?: ISupplier;
    active: boolean;
}