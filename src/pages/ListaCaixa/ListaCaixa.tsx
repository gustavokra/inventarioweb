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

    useEffect(() => {
        fetchOperacoes();
    }, []);

    const fetchOperacoes = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/caixa', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Operações de Caixa</h1>
                    <Button 
                        onClick={() => navigate('/caixa')}
                        className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]"
                    >
                        Gerenciar Caixa
                    </Button>
                </div>

                <Table>
                    <TableCaption>Lista de operações de caixa</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data Abertura</TableHead>
                            <TableHead>Data Fechamento</TableHead>
                            <TableHead>Saldo Inicial</TableHead>
                            <TableHead>Total Vendas</TableHead>
                            <TableHead>Saldo Final</TableHead>
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
                                <TableCell>{formatarMoeda(operacao.totalVendas || 0)}</TableCell>
                                <TableCell>
                                    {operacao.saldoFinal ? formatarMoeda(operacao.saldoFinal) : '-'}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        operacao.situacao === 'aberto' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {operacao.situacao === 'aberto' ? 'Aberto' : 'Fechado'}
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