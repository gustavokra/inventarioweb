import { IOrder } from '@/@types/IOrder';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    const [dateOrder, setDateOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://35.198.61.242:8080/api/v1/order', {
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
            const updatedOrder = { ...order, enumStatus: 'COMPLETED' };
            const response = await fetch(`https://35.198.61.242:8080/api/v1/order/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(order.id)
                },
                body: JSON.stringify(updatedOrder)
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleOrdersPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOrdersPerPage(Number(event.target.value));
        setCurrentPage(1);
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
    }).sort((a, b) => {
        const dateA = new Date(a.createdAt || '').getTime();
        const dateB = new Date(b.createdAt || '').getTime();
        return dateOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ordersPerPage,
        currentPage * ordersPerPage
    );

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const getPageNumbers = () => {
        const maxPagesToShow = 10;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    };

    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Pedidos</h1>
                    <Button 
                        onClick={handleCadaster}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
                    >
                        Novo Pedido
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
                    <div className='space-y-2'>
                        <label htmlFor='orders-per-page' className='text-sm font-medium text-gray-700'>
                            Pedidos por página
                        </label>
                        <select
                            id='orders-per-page'
                            value={ordersPerPage}
                            onChange={handleOrdersPerPageChange}
                            className='w-full border border-gray-300 rounded-md p-2'
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
                    <Table>
                        <TableCaption>Lista de pedidos cadastrados</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50'>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Id</TableHead>
                                <TableHead 
                                    className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100'
                                    onClick={() => setDateOrder(dateOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    Data {dateOrder === 'asc' ? '↑' : '↓'}
                                </TableHead>
                                <TableHead className='w-4/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Cliente</TableHead>
                                <TableHead className='w-2/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Subtotal (R$)</TableHead>
                                <TableHead className='w-2/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Desconto (R$)</TableHead>
                                <TableHead className='w-2/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Total (R$)</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Situação</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Gerado no Caixa</TableHead>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOrders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <TableRow 
                                        className='hover:bg-gray-50 transition-colors cursor-pointer'
                                        onClick={() => handleRowClick(order.id)}
                                    >
                                        <TableCell className='py-3 px-4'>{order.id}</TableCell>
                                        <TableCell className='py-3 px-4'>{FormatDate(order.createdAt)}</TableCell>
                                        <TableCell className='py-3 px-4'>{order.client.name} - {order.client.document}</TableCell>
                                        <TableCell className='py-3 px-4 text-right'>
                                            {((order.totalValue || 0) + (order.discount || 0)).toFixed(2).replace('.', ',')}
                                        </TableCell>
                                        <TableCell className='py-3 px-4 text-right'>
                                            {(order.discount || 0).toFixed(2).replace('.', ',')}
                                        </TableCell>
                                        <TableCell className='py-3 px-4 text-right'>
                                            {order.totalValue?.toFixed(2).replace('.', ',') || '0,00'}
                                        </TableCell>
                                        <TableCell className='py-3 px-4'>
                                            <div className='flex justify-center'>
                                                <StatusLabel
                                                    isPrimary={order.enumStatus === 'COMPLETED'}
                                                    primaryText='Finalizado'
                                                    secondText='Pendente'
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className='py-3 px-4'>
                                            <div className='flex justify-center'>
                                                {order.geradoNoCaixa ? 'Sim' : 'Não'}
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
                                                    variant="outline"
                                                    onClick={() => handleEdit(order)}
                                                    className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors"
                                                >
                                                    Editar
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {expandedOrderId === order.id && (
                                        <TableRow>
                                            <TableCell colSpan={10} className="bg-gray-50 p-4">
                                                <div className="space-y-6">
                                                    {/* Seção de Observação */}
                                                    {order.observacao && (
                                                        <div className="space-y-2">
                                                            <h3 className="font-semibold text-lg">Observação</h3>
                                                            <p className="text-sm text-gray-700">
                                                                {order.observacao}
                                                            </p>
                                                        </div>
                                                    )}

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
                                                        <div className="flex text-right text-sm font-medium text-gray-900 pt-2 grid grid-cols-2 gap-4 justify-end">
                                                            <div className="col-span-2">
                                                                Subtotal: R$ {((order.totalValue || 0) + (order.discount || 0)).toFixed(2).replace('.', ',')}
                                                            </div>
                                                            <div className="col-span-2">
                                                                Desconto: R$ {(order.discount || 0).toFixed(2).replace('.', ',')}
                                                            </div>
                                                            <div className="col-span-2">
                                                                Total Final: R$ {order.totalValue?.toFixed(2).replace('.', ',') || '0,00'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={10} className='py-3 px-4'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-sm font-medium'>
                                            Total de Pedidos: {filteredOrders.length}
                                        </span>
                                        <div className='flex items-center space-x-2'>
                                            {getPageNumbers().map((pageNumber) => (
                                                <Button
                                                    key={pageNumber}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={`px-3 py-1 text-xs border rounded-md ${currentPage === pageNumber ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'}`}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </section>
    );
}
