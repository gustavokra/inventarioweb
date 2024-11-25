import { IOrder } from "./IOrder";
import { IProduct } from "./IProduct";

export interface ITransaction {
    id: number,
    createdAt: string,
    transactionType: string,
    value: number,
    product: IProduct,
    order: IOrder
}