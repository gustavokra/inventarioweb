import { EnumOrderStatus } from '@/@types/EnumOrderStatus';
import { IOrder } from '@/@types/IOrder';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';

export default function ClientList() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [createdAtFilter, setDateFilter] = useState<string>('');
    const [clientFilter, setClientFilter] = useState<string>('');
    const [productFilter, setProductFilter] = useState<string>('');
    const [enumStatusFilter, setStatusFilter] = useState<string>('');
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
                    throw new Error('Erro ao buscar os dados');
                }
                setOrders(await response.json());
                console.log(orders)
            } catch (err: unknown) {
                console.log(err);
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
            enumStatus: EnumOrderStatus.COMPLETED
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
                throw new Error('Erro ao finalizar pedido');
            }

            setReload((prev) => !prev);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const filteredOrders = orders.filter(order => {
        let hasMatchingProduct = order.items?.some(item =>
            item.product.name.toLowerCase().includes(productFilter.toLowerCase())
        );

        let orderStatus = order.enumStatus.toString() === "PENDING" ? "pendente" : "concluído";

        return order.createdAt?.includes(createdAtFilter) &&
            order.client.name.toLowerCase().includes(clientFilter.toLowerCase()) &&

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
                    onChange={(e) => setDateFilter(e.target.value)}
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
                        <TableHead className='w-2/12 text-left'>Criação</TableHead>
                        <TableHead className='w-4/12 text-left'>Cliente</TableHead>
                        <TableHead className='w-3/12 text-right'>Total (R$)</TableHead>
                        <TableHead className='w-2/12 text-center'>Situação</TableHead>
                        <TableHead className='w-1/12 text-center'>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className='text-left'>{order.createdAt}</TableCell>
                            <TableCell className='text-left'>{order.client.name}</TableCell>
                            <TableCell className='text-right'>{order.totalValue.toString().replace('.', ',')}</TableCell>
                            <TableCell className="text-center">
                                <StatusLabel
                                    isPrimary = {order.enumStatus.toString() === "COMPLETED"}
                                    primaryText='Concluído'
                                    secondText='Pendente'
                                />
                            </TableCell>
                            <TableCell className='flex justify-end gap-3'>
                                {
                                    order.enumStatus.toString() === "COMPLETED" &&
                                    <Button variant='destructive' className='w-5/12'
                                        onClick={() => handleCompleteOrder(order)}>
                                        Finalizar
                                    </Button>
                                }
                                <Button variant='default' className='w-5/12' onClick={() => handleEdit(order)}>Editar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className='text-right'>{filteredOrders.length} {filteredOrders.length > 1 ? 'Pedidos' : 'Pedido'} </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    );
}
