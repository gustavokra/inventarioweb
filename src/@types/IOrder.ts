import { IClient } from "./IClient";
import { IOrderItem } from "./IOrderItem";
import { ITitulo } from "./ITitulo";

export interface IOrder {
    id?: number,
    createdAt?: string,
    client: IClient,
    totalValue?: number,
    discount?: number,
    enumStatus: string,
    items: IOrderItem[],
    titulos: ITitulo[],
    geradoNoCaixa?: boolean,
    observacao?: string
}