export interface IOperacaoCaixa {
    id?: number;
    dataAbertura: string;
    dataFechamento?: string;
    saldoInicial: number;
    saldoFinal?: number;
    totalMovimentado?: number;
    situacao: 'ABERTO' | 'FECHADO';
    observacoes?: string;
    usuarioId: number;
}