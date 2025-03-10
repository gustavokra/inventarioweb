import { IProduct } from "./IProduct";

export interface IItemPDV {
    produtoId: number;
    product: IProduct;
    quantidade: number;
    valorUnitario: number;
    desconto?: number;
    total: number;
}

export interface IVendaPDV {
    id?: number;
    data: string;
    itens: IItemPDV[];
    subtotal: number;
    desconto?: number;
    total: number;
    formaPagamento: string;
    operacaoCaixaId: number;
    clienteId?: number;
    situacao: 'pendente' | 'finalizada' | 'cancelada';
    usuarioId: number;
} 