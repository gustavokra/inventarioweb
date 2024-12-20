import { IClient } from "./IClient";
import { IOrderItem } from "./IOrderItem";

export interface IOrder {
    id?: number,
    createdAt?: string,
    client: IClient,
    totalValue?: number,
    enumStatus: string,
    items: IOrderItem[],
}