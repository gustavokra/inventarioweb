import { IOperacaoCaixa } from '@/@types/ICaixa';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCaixa } from '@/context/CaixaContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListaCaixa() {
    const { toast } = useToast();
    const [operacoes, setOperacoes] = useState<IOperacaoCaixa[]>([]);
    const navigate = useNavigate();
    const { setOperacaoAtual } = useCaixa();
    const [caixaAberto, setCaixaAberto] = useState<IOperacaoCaixa | null>(null);

    useEffect(() => {
        fetchOperacoes();
    }, []);

    useEffect(() => {
        // Encontrar operação aberta quando a lista de operações for atualizada
        const operacaoAberta = operacoes.find(op => op.situacao === 'ABERTO');
        setCaixaAberto(operacaoAberta || null);
    }, [operacoes]);

    const fetchOperacoes = async () => {
        try {
            const response = await fetch('https://35.198.61.242:8443/api/v1/operacao-caixa', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao buscar operações",
                    description: errorData.details,
                });
                return;
            }

            const data = await response.json();
            setOperacoes(data);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao buscar as operações de caixa.",
            });
        }
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleString('pt-BR');
    };

    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const handleCaixaClick = () => {
        if (caixaAberto) {
            // Se há um caixa aberto, configura ele como atual e navega para fechamento
            setOperacaoAtual(caixaAberto);
            navigate('/caixa');
        } else {
            // Se não há caixa aberto, navega para abertura de novo caixa
            navigate('/caixa');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Operações de Caixa</h1>
                    <Button 
                        onClick={handleCaixaClick}
                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                    >
                        {caixaAberto ? 'Fechar Caixa' : 'Abrir Caixa'}
                    </Button>
                </div>

                <Table>
                    <TableCaption>Lista de operações de caixa</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data Abertura</TableHead>
                            <TableHead>Data Fechamento</TableHead>
                            <TableHead>Saldo Inicial</TableHead>
                            <TableHead>Saldo Final</TableHead>
                            <TableHead>Total Movimentado</TableHead>
                            <TableHead>Situação</TableHead>
                            <TableHead>Observações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {operacoes.map((operacao) => (
                            <TableRow key={operacao.id}>
                                <TableCell>{formatarData(operacao.dataAbertura)}</TableCell>
                                <TableCell>
                                    {operacao.dataFechamento ? formatarData(operacao.dataFechamento) : '-'}
                                </TableCell>
                                <TableCell>{formatarMoeda(operacao.saldoInicial)}</TableCell>
                                <TableCell>
                                    {operacao.saldoFinal ? formatarMoeda(operacao.saldoFinal) : '-'}
                                </TableCell>
                                <TableCell>{formatarMoeda(operacao.totalMovimentado || 0)}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        operacao.situacao === 'ABERTO' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {operacao.situacao === 'ABERTO' ? 'Aberto' : 'Fechado'}
                                    </span>
                                </TableCell>
                                <TableCell>{operacao.observacoes || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}