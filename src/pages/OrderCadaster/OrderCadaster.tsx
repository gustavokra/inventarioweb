import { IClient } from '@/@types/IClient';
import { IOrder } from '@/@types/IOrder';
import { IOrderItem } from '@/@types/IOrderItem';
import { IProduct } from '@/@types/IProduct';
import { ProductCombobox } from '@/components/ProductComboBox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderCadaster() {
    const { toast } = useToast();

    const { order, setOrder } = useOrder();
    const navigate = useNavigate();

    const [id, setId] = useState(0);
    const [client, setClient] = useState<IClient>();
    const [totalValue, setTotalValue] = useState<number>(0);
    const admin = localStorage.getItem('admin') === 'true';

    const [items, setItems] = useState<IOrderItem[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [clients, setClients] = useState<IClient[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);

    useEffect(() => {

        const fetchClients = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/client', {
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
                        title: "Erro ao buscar clientes",
                        description: errorData.details,
                    });

                    return
                }

                setClients(await response.json());
            } catch (err: unknown) {
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao buscar clientes. Tente novamente ou contate o suporte." });
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/product', {
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
                        title: "Erro ao buscar produtos",
                        description: errorData.details,
                    });

                    return;
                }


                setProducts(await response.json());
            } catch (err: unknown) {
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao buscar produtos. Tente novamente ou contate o suporte." });
            }
        };

        fetchClients();
        fetchProducts();

        if (order) {
            setId(order.id ? order.id : 0)
            setClient(order.client);
            setItems(order.items);
        }

    }, [order]);

    const handleReturnToList = () => {
        setOrder(null)
        navigate('/orders')
    }

    const handleSelectProduct = (selectedProduct: IProduct) => {
        const newItem: IOrderItem = {
            product: selectedProduct,
            quantity: 1,
            unitPrice: selectedProduct.price,
        };

        setItems((prevItems) => [...prevItems, newItem]);
    };

    const handleChangeItemQuantity = (item: IOrderItem, e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = e.target.value ? parseInt(e.target.value) : 1;
        setItems((prev) =>
            prev.map((prevItem) => {
                return prevItem.product.id === item.product.id ? { ...prevItem, quantity: newQuantity } : prevItem;
            })
        );
    }

    const handleRemoveItem = (itemToRemove: IOrderItem) => {
        setItems((prevItems) =>
            prevItems.filter((item) => item.product.id !== itemToRemove.product.id)
        );

        setSelectedProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== itemToRemove.product.id)
        );
    }

    const getOrderTotalValue = () => {
        const total = items.reduce((total, item) => {
            const price = item.unitPrice || 0;
            const quantity = item.quantity || 0;
            return total + (price * quantity);
        }, 0);
        return total.toFixed(2).replace('.', ',');
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!client) {
            throw new Error('Cliente é obrigatório');
        }

        const orderData: IOrder = {
            client,
            enumStatus: "PENDING",
            items
        };

        console.log(orderData)

        order ? updateOrder(orderData) : registerOrder(orderData)
    };

    const handleExecuteSucessSubmit = () => {
        setOrder(null);
        navigate('/orders');
    }

    const registerOrder = async (orderDataToRegister: IOrder) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(orderDataToRegister),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao cadastrar",
                    description: errorData.details,
                });

                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Cadastro realizada com sucesso." });

            handleExecuteSucessSubmit()

        } catch (error) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao cadastrar. Tente novamente ou contate o suporte." });
        }

    }

    const updateOrder = async (orderDataToUpdate: IOrder) => {

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/order', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(order ? order.id : 0)
                },
                body: JSON.stringify(orderDataToUpdate)
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar",
                    description: errorData.details,
                });
                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Atualização realizada com sucesso." });

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao atualizar. Tente novamente ou contate o suporte." });
        }
    };

    const deleteOrder = async () => {

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/order', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(order ? order.id : 0)
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar deletar",
                    description: errorData.details,
                });

                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Remoção realizada com sucesso." });
            
            handleExecuteSucessSubmit()

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao deletar. Tente novamente ou contate o suporte." }); 
        }
    };

    return (
        <section id='orders' className='container w-3/4 mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10 flex flex-col gap-y-10'>
            <header>
                <h3>Cadastro de Pedido</h3>
                {order &&
                    admin ?
                    <div className='flex justify-end'>
                        <Button variant='destructive'
                            onClick={deleteOrder}>
                            Excluir
                        </Button>
                    </div>
                    : null
                }
            </header>

            <form onSubmit={handleSubmit} className='flex flex-col gap-y-10'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-4'>
                    <div>
                        <Label htmlFor="client">Cliente:</Label>
                        <Select value={client?.id ? String(client.id) : ""}
                            onValueChange={(value) => {
                                const selectedClient = clients?.find((cli) => String(cli.id) === value);
                                if (selectedClient) {
                                    setClient(selectedClient);
                                }
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {clients && clients.map((cli) => (
                                        <SelectItem key={cli.id}
                                            onClick={() => { setClient(cli) }}
                                            value={String(cli.id)}>
                                            {cli.name} - {cli.document}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="products">Produtos:</Label>
                        <ProductCombobox
                            products={products}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            handleSelectProduct={handleSelectProduct}
                        />
                    </div>
                </div>

                <section id='selected-products-table'>
                    <Table>
                        <TableCaption>Produtos selecionados</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-1/12 text-center'>Imagem</TableHead>
                                <TableHead className='w-3/12 text-left'>Nome</TableHead>
                                <TableHead className='w-2/12 text-right'>Quantidade</TableHead>
                                <TableHead className='w-3/12 text-right	'>Preço Unitário (R$)</TableHead>
                                <TableHead className='w-2/12 text-right	'>Total (R$)</TableHead>
                                <TableHead className='w-1/12 text-center'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.product.id}>
                                    <TableCell className='text-center'><img src={item.product.image} /></TableCell>
                                    <TableCell className='text-left'>{item.product.name}</TableCell>
                                    <TableCell className='text-right'>
                                        <Input className='text-right' maxLength={10} value={item.quantity}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeItemQuantity(item, e)} />
                                    </TableCell>
                                    <TableCell className='text-right'>{item.unitPrice.toFixed(2).replace('.', ',')}</TableCell>
                                    <TableCell className='text-right'>{(item.quantity * item.unitPrice).toFixed(2).replace('.', ',')}</TableCell>
                                    <TableCell className='text-center flex items-center justify-center gap-3 '>
                                        <Button variant='destructive' className='w-10/12' onClick={() => handleRemoveItem(item)}>Remover</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className='text-left' colSpan={3}>
                                    Quantidade: {selectedProducts.length} produtos
                                </TableCell>
                                <TableCell className='text-right' colSpan={3}>
                                    Valor Total Pedido: R${getOrderTotalValue()}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </section>

                <div className='flex flex-col md:flex-row gap-4 mt-4'>
                    <Button className='md:w-1/4 order-2 md:order-1' variant='destructive'
                        onClick={() => handleReturnToList()}>
                        Voltar para lista
                    </Button>
                    <Button className='md:w-3/4 order-1 md:order-2' variant='default'>{order ? 'Atualizar Pedido' : 'Cadastrar'}</Button>
                </div>
            </form>

        </section>
    )
}