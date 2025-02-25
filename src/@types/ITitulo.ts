import { IFormaPagamento } from "./IFormaPagamento";

export interface ITitulo {
    formaPagamento: IFormaPagamento;
    numeroParcelas: number;
    valorParcelas: number;
    idPedido: number;
    geradoNoCaixa: boolean;
}