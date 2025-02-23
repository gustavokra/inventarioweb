export interface IOperacaoCaixa {
    id?: number;
    dataAbertura: string;
    dataFechamento?: string;
    saldoInicial: number;
    saldoFinal?: number;
    totalVendas?: number;
    totalVendasDinheiro?: number;
    totalVendasCartao?: number;
    totalVendasPix?: number;
    situacao: 'aberto' | 'fechado';
    observacoes?: string;
    usuarioId: number;
}

export interface IMovimentacaoCaixa {
    id?: number;
    data: string;
    tipo: 'entrada' | 'saida';
    valor: number;
    descricao: string;
    formaPagamento: string;
    operacaoCaixaId: number;
} 