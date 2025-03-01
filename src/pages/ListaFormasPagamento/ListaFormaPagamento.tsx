import { IFormaPagamento } from '@/@types/IFormaPagamento';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFormaPagamento } from '@/context/FormaPagamentoContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListaFormaPagamento() {
    const { toast } = useToast();
    const [formasPagamento, setFormasPagamento] = useState<IFormaPagamento[]>([]);
    const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');
    const { setFormaPagamento } = useFormaPagamento();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/forma-pagamento', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'dbImpl': 'SQLITE',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    toast({
                        variant: "destructive",
                        title: "Erro ao trazer dados",
                        description: errorData.details,
                    });
                    return;
                }
                setFormasPagamento(await response.json());
                
            } catch (err: unknown) {
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao trazer dados." });
            }
        };

        fetchData();
    },);

    const sortFormasPagamentoByName = (order: 'asc' | 'desc') => {
        const sortedFormasPagamento = [...formasPagamento].sort((a, b) => {
            if (order === 'asc') {
                return a.nome.localeCompare(b.nome);
            } else {
                return b.nome.localeCompare(a.nome);
            }
        });
        return sortedFormasPagamento;
    };

    const sortedFormasPagamento = sortFormasPagamentoByName(nameSortOrder);

    const handleCadaster = () => {
        navigate('/forma-pagamento/cadaster');
    };

    const handleEdit = (formaPagamento: IFormaPagamento) => {
        setFormaPagamento(formaPagamento);
        navigate('/forma-pagamento/cadaster');
    }

    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Formas de Pagamento</h1>
                    <Button 
                        onClick={handleCadaster}
                        className='bg-zinc-900 hover:bg-zinc-800 text-white transition-colors'
                    >
                        Cadastrar Forma de Pagamento
                    </Button>
                </div>

                {/* Table */}
                <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
                    <Table>
                        <TableCaption>Lista de formas de pagamento</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50'>
                                <TableHead 
                                    className='w-6/12 text-left py-3 px-4 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100'
                                    onClick={() => setNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    Nome {nameSortOrder === 'asc' ? '↑' : '↓'}
                                </TableHead>
                                <TableHead className='w-4/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Número Máximo de Parcelas</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedFormasPagamento.map((formaPagamento) => (
                                <TableRow key={formaPagamento.id} className='hover:bg-gray-50 transition-colors'>
                                    <TableCell className='py-3 px-4'>{formaPagamento.nome}</TableCell>
                                    <TableCell className='py-3 px-4'>{formaPagamento.numeroMaxParcelas}</TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center'>
                                            <Button 
                                                variant="outline" 
                                                onClick={() => handleEdit(formaPagamento)}
                                                className='border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors'
                                            >
                                                Editar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}
