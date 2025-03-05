import { EnumTransactionType } from '@/@types/EnumTransactionType';
import { ITransaction } from '@/@types/ITransaction';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FormatDate from '@/util/FormatDate';
import { useEffect, useState } from 'react';

export default function TransactionList() {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [dateFilter, setDateFilter] = useState<string>('');
    const [typeSortOrder, setTypeSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://inventarioweb-seven.vercel.app/api/v1/transaction', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'dbImpl': 'SQLITE',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados');
                }
                setTransactions(await response.json());
            } catch (err: unknown) {
            }
        };

        fetchData();
    },);


    const filteredTransactions = transactions.filter(transaction => 
        FormatDate(transaction?.createdAt).toLowerCase().includes(dateFilter.toLowerCase())
    );

    const sortTransactionsByName = (order: 'asc' | 'desc') => {
        const sortedTransactions = [...filteredTransactions].sort((a, b) => {
            if (order === 'asc') {
                return a.transactionType.localeCompare(b.transactionType);
            } else {
                return b.transactionType.localeCompare(a.transactionType);
            }
        });
        return sortedTransactions;
    };
    const sortedTransactions = sortTransactionsByName(typeSortOrder);

    return (
        <section id='transaction_list' className='container flex flex-col gap-4 w-10/12 mt-4 '>
            <div className='flex justify-between mb-4'>
                <h3>Transações</h3>
            </div>

            <div className='flex md:flex-row gap-4 w-full md:w-1/2'>
                <Input
                    type='text'
                    placeholder='Filtrar por data'
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
                <Button onClick={() => setTypeSortOrder(typeSortOrder === 'asc' ? 'desc' : 'asc')}>
                    Tipo {typeSortOrder === 'asc' ? '↑' : '↓'}
                </Button>
            </div>

            <Table>
                <TableCaption>Uma lista de seus fornecedores.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-1/12 text-left'>Id</TableHead>
                        <TableHead className='w-2/12 text-left'>Criação</TableHead>
                        <TableHead className='w-3/12 text-right'>Valor</TableHead>
                        <TableHead className='w-4/12 text-left'>Produto</TableHead>
                        <TableHead className='w-1/12 text-left'>Id Pedido</TableHead>
                        <TableHead className='w-1/12 text-center'>Tipo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className='text-left'>{transaction.id}</TableCell>
                            <TableCell className='text-left'>{FormatDate(transaction.createdAt)}</TableCell>
                            <TableCell className='text-right'>{transaction.value.toFixed(2).replace('.', ',')}</TableCell>
                            <TableCell className='text-left'>{transaction.product.name}</TableCell>
                            <TableCell className='text-left'>{transaction.order.id}</TableCell>
                            <TableCell className='text-center'>
                                <StatusLabel
                                    isPrimary={transaction.transactionType !== EnumTransactionType.INPUT.toString()}
                                    primaryText='Entrada'
                                    secondText='Saída'
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className='text-right'>{filteredTransactions.length} transações</TableCell>
                    </TableRow>
                </TableFooter>
            </Table >
        </section >
    );
}
