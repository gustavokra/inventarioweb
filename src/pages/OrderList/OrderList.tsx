import { IOrder } from '@/@types/IOrder';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';
import FormatDate from '@/util/FormatDate';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function OrderList() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
    const [createdAtFilter, setCreatedAtFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [enumStatusFilter, setEnumStatusFilter] = useState('');
    const [reload, setReload] = useState(false);
    const { setOrder } = useOrder();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/order', {
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
                setOrders(await response.json());
                console.log(orders);
            } catch (err: unknown) {
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao trazer dados." });
            }
        };

        fetchData();
    }, [reload]);

    const handleCadaster = () => {
        navigate('/orders/cadaster');
    };

    const handleEdit = (order: IOrder) => {
        setOrder(order);
        navigate('/orders/cadaster');
    }

    const handleCompleteOrder = async (order: IOrder) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/order/${order.id}/complete`, {
                method: 'PUT',
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
                    title: "Erro ao finalizar pedido",
                    description: errorData.details,
                });
                return;
            }

            setReload(!reload);
            toast({
                title: "Sucesso",
                description: "Pedido finalizado com sucesso!",
            });
        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao finalizar o pedido." });
        }
    };

    const handleRowClick = (orderId: number | undefined) => {
        if (orderId !== undefined) {
            setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
        }
    };

    const filteredOrders = orders.filter(order => {
        const formattedDate = order.createdAt || '';
        const hasMatchingProduct = order.items?.some(item =>
            item.product.name.toLowerCase().includes(productFilter.toLowerCase())
        );
        const orderStatus = order.enumStatus === 'PENDING' ? 'pendente' : 'finalizado';

        return formattedDate.toLowerCase().includes(createdAtFilter.toLowerCase()) &&
            (order.client.name.toLowerCase().includes(clientFilter.toLowerCase()) ||
                order.client.document.toLowerCase().includes(clientFilter.toLowerCase())) &&
            orderStatus.includes(enumStatusFilter.toLowerCase()) &&
            hasMatchingProduct;
    });

    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Pedidos</h1>
                    <Button 
                        onClick={handleCadaster}
                        className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors'
                    >
                        Cadastrar Pedido
                    </Button>
                </div>

                {/* Filters */}
                <div className='grid grid-cols-1 sm:grid-cols-4 gap-4'>
                    <div className='space-y-2'>
                        <label htmlFor='date-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por Data
                        </label>
                        <Input
                            id='date-filter'
                            type='text'
                            placeholder='Digite a data'
                            value={createdAtFilter}
                            onChange={(e) => setCreatedAtFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='client-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por Cliente
                        </label>
                        <Input
                            id='client-filter'
                            type='text'
                            placeholder='Digite o cliente'
                            value={clientFilter}
                            onChange={(e) => setClientFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='product-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por Produto
                        </label>
                        <Input
                            id='product-filter'
                            type='text'
                            placeholder='Digite o produto'
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='status-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por Situação
                        </label>
                        <Input
                            id='status-filter'
                            type='text'
                            placeholder='Digite a situação'
                            value={enumStatusFilter}
                            onChange={(e) => setEnumStatusFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                </div>

                {/* Table */}
                <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
                    <Table>
                        <TableCaption>Lista de pedidos cadastrados</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50'>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Id</TableHead>
                                <TableHead className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Data</TableHead>
                                <TableHead className='w-4/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Cliente</TableHead>
                                <TableHead className='w-2/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Total (R$)</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Situação</TableHead>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                console.log(order),
                                <React.Fragment key={order.id}>
                                    <TableRow 
                                        className='hover:bg-gray-50 transition-colors cursor-pointer'
                                        onClick={() => handleRowClick(order.id)}
                                    >
                                        <TableCell className='py-3 px-4'>{order.id}</TableCell>
                                        <TableCell className='py-3 px-4'>{FormatDate(order.createdAt)}</TableCell>
                                        <TableCell className='py-3 px-4'>{order.client.name} - {order.client.document}</TableCell>
                                        <TableCell className='py-3 px-4 text-right'>
                                            {order.totalValue?.toFixed(2).replace('.', ',') || '0,00'}
                                        </TableCell>
                                        <TableCell className='py-3 px-4'>
                                            <div className='flex justify-center'>
                                                <StatusLabel
                                                    isPrimary={order.enumStatus === 'completed'}
                                                    primaryText='Finalizado'
                                                    secondText='Pendente'
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className='py-3 px-4' onClick={(e) => e.stopPropagation()}>
                                            <div className='flex justify-center gap-2'>
                                                {order.enumStatus === 'PENDING' && (
                                                    <Button 
                                                        variant='destructive'
                                                        onClick={() => handleCompleteOrder(order)}
                                                        className='px-3 py-1 text-xs'
                                                    >
                                                        Finalizar
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant='outline'
                                                    onClick={() => handleEdit(order)}
                                                    className='px-3 py-1 text-xs text-gray-900 hover:text-gray-900 border-gray-200'
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {expandedOrderId === order.id && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="bg-gray-50 p-4">
                                                <div className="space-y-6">
                                                    {/* Seção de Itens */}
                                                    <div className="space-y-4">
                                                        <h3 className="font-semibold text-lg">Itens do Pedido</h3>
                                                        <div className="grid grid-cols-4 gap-4 font-medium text-sm text-gray-700 pb-2">
                                                            <div>Produto</div>
                                                            <div className="text-center">Quantidade</div>
                                                            <div className="text-right">Valor Unitário</div>
                                                            <div className="text-right">Subtotal</div>
                                                        </div>
                                                        {order.items?.map((item, index) => (
                                                            <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                                                                <div>{item.product.name}</div>
                                                                <div className="text-center">{item.quantity}</div>
                                                                <div className="text-right">
                                                                    R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                                                                </div>
                                                                <div className="text-right">
                                                                    R$ {(item.quantity * item.unitPrice).toFixed(2).replace('.', ',')}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Seção de Pagamentos */}
                                                    <div className="space-y-4 border-t pt-4">
                                                        <h3 className="font-semibold text-lg">Pagamentos</h3>
                                                        <div className="grid grid-cols-4 gap-4 font-medium text-sm text-gray-700 pb-2">
                                                            <div>Forma de Pagamento</div>
                                                            <div className="text-center">Número de Parcelas</div>
                                                            <div className="text-right">Valor das Parcelas</div>
                                                            <div className="text-right">Valor Total</div>
                                                        </div>
                                                        {order.titulos?.map((titulo, index) => (
                                                            <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                                                                <div>{titulo.formaPagamento.nome}</div>
                                                                <div className="text-center">{titulo.numeroParcelas}x</div>
                                                                <div className="text-right">
                                                                    R$ {(titulo.valorParcelas / titulo.numeroParcelas).toFixed(2).replace('.', ',')}
                                                                </div>
                                                                <div className="text-right">
                                                                    R$ {titulo.valorParcelas.toFixed(2).replace('.', ',')}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="text-right text-sm font-medium text-gray-900 pt-2">
                                                            Total: R$ {order.totalValue?.toFixed(2).replace('.', ',') || '0,00'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </section>
    );
}
