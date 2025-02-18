import { IOrder } from '@/@types/IOrder';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FormatDate from '@/util/FormatDate';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '@/hooks/use-toast';

export default function ClientList() {
    const { toast } = useToast();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [createdAtFilter, setCreatedAtFilter] = useState<string>('');
    const [clientFilter, setClientFilter] = useState<string>('');
    const [productFilter, setProductFilter] = useState<string>('');
    const [enumStatusFilter, setStatusFilter] = useState<string>('');
    const [reload, setReload] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
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

        const orderDataToUpdate = {
            enumStatus: "COMPLETED"
        }

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/order', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(order.id)
                },
                body: JSON.stringify(orderDataToUpdate)
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar status",
                    description: errorData.details,
                });

                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Mudança de status realizada com sucesso." });

            setReload((prev) => !prev);
        } catch (err: unknown) {
            toast({
                variant: "destructive", title: "Erro inesperado", description: "Erro ao mudar status. Tente novamente ou contate o suporte."
            });
        }
    };

    const toggleOrderItems = (orderId: number) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const filteredOrders = orders.filter(order => {
        const formattedDate = order.createdAt ? FormatDate(order.createdAt) : '';

        let hasMatchingProduct = order.items?.some(item =>
            item.product.name.toLowerCase().includes(productFilter.toLowerCase())
        );

        let orderStatus = order.enumStatus.toString() === "PENDING" ? "pendente" : "concluído";

        return formattedDate.toLowerCase().includes(createdAtFilter.toLowerCase()) &&

            (order.client.name.toLowerCase().includes(clientFilter.toLowerCase()) ||
            order.client.document.toLowerCase().includes(clientFilter.toLowerCase())) &&

            orderStatus.includes(enumStatusFilter.toLowerCase()) &&

            hasMatchingProduct
    });

    return (
        <section id='order_list' className='container flex flex-col gap-4 justify-center w-10/12 mt-4 mx-auto'>
            <div className='flex justify-between mb-4'>
                <h3>Pedidos</h3>
                <Button variant='default' onClick={handleCadaster}>Cadastrar</Button>
            </div>

            <div className='flex md:flex-row gap-4 w-full md:w-1/2'>
                <Input
                    type='text'
                    placeholder='Filtrar por data'
                    value={createdAtFilter}
                    onChange={(e) => setCreatedAtFilter(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Filtrar por cliente'
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Filtrar por produto'
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                />
                <Input
                    type='text'
                    placeholder='Filtrar por situação'
                    value={enumStatusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                />
            </div>

            <Table>
                <TableCaption>Uma lista de seus pedidos.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-1/12 text-left'>Id</TableHead>
                        <TableHead className='w-2/12 text-left'>Criação</TableHead>
                        <TableHead className='w-4/12 text-left'>Cliente</TableHead>
                        <TableHead className='w-3/12 text-right'>Total Pedido (R$)</TableHead>
                        <TableHead className='w-2/12 text-center'>Situação</TableHead>
                        <TableHead className='w-1/12 text-center'>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredOrders.map((order) => (
                        <React.Fragment key={order.id}>
                            <TableRow onClick={() => toggleOrderItems(order.id ? order.id : 0)} style={{ cursor: 'pointer' }}>
                                <TableCell className='text-left'>{order.id}</TableCell>
                                <TableCell className="text-left">{FormatDate(order.createdAt)}</TableCell>
                                <TableCell className="text-left">{order.client.name} - {order.client.document}</TableCell>
                                <TableCell className="text-right">{order.totalValue?.toFixed(2).replace('.', ',')}</TableCell>
                                <TableCell className="text-center">
                                    <StatusLabel
                                        isPrimary={order.enumStatus.toString() === "COMPLETED"}
                                        primaryText="Concluído"
                                        secondText="Pendente"
                                    />
                                </TableCell>
                                <TableCell className="flex justify-end gap-3">
                                    {order.enumStatus.toString() === "PENDING" && (
                                        <Button
                                            variant="destructive"
                                            className="w-10/12"
                                            onClick={() => handleCompleteOrder(order)}
                                        >
                                            Finalizar
                                        </Button>
                                    )}
                                    <Button variant="default" className="w-12/12" onClick={() => handleEdit(order)}>
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>

                            {expandedOrderId === order.id && (
                                <TableRow key={order.id + "items"}>
                                    <TableCell colSpan={6} className="p-4">
                                        <div className="bg-gray-100 p-3 rounded">
                                            <h4 className="font-semibold mb-2">Itens do Pedido:</h4>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-4/12 text-left">Nome</TableHead>
                                                        <TableHead className="w-2/12 text-right">Quantidade</TableHead>
                                                        <TableHead className="w-3/12 text-right">Preço Unitário (R$)</TableHead>
                                                        <TableHead className="w-3/12 text-right">Total Item (R$)</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {order.items.map((item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell className="text-left">{item.product.name}</TableCell>
                                                            <TableCell className="text-right">{item.quantity}</TableCell>
                                                            <TableCell className="text-right">{item.unitPrice.toFixed(2).replace('.', ',')}</TableCell>
                                                            <TableCell className="text-right">
                                                                {(item.quantity * item.unitPrice).toFixed(2).replace('.', ',')}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className='text-right'>{filteredOrders.length} {filteredOrders.length > 1 ? 'Pedidos' : 'Pedido'} </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    );
}
