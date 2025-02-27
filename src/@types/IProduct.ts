import { IGrupo } from "./IGrupo";
import { IMarca } from "./IMarca";
import { ISupplier } from "./ISupplier";

export interface IProduct {
    id?: number;
    image: string;
    name: string;
    description: string;
    marca?: IMarca;
    grupo?: IGrupo;
    costPrice: number;
    price: number;
    quantity: number;
    supplier?: ISupplier;
    active: boolean;
}