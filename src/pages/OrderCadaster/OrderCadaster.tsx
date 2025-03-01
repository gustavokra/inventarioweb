import { IClient } from '@/@types/IClient';
import { IFormaPagamento } from '@/@types/IFormaPagamento';
import { IOrder } from '@/@types/IOrder';
import { IOrderItem } from '@/@types/IOrderItem';
import { IProduct } from '@/@types/IProduct';
import { ITitulo } from '@/@types/ITitulo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useOrder } from '@/context/OrderContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCombobox } from '@/components/ProductComboBox';

export default function CadastroPedido() {
    const { toast } = useToast();
    const { order, setOrder } = useOrder();
    const navigate = useNavigate();
    const admin = localStorage.getItem('admin') === 'true';

    // Estados
    const [client, setClient] = useState<IClient>();
    const [observacao, setObservacao] = useState<string>('');
    const [items, setItems] = useState<IOrderItem[]>([]);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [clients, setClients] = useState<IClient[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
    const [formasPagamento, setFormasPagamento] = useState<IFormaPagamento[]>([]);
    const [pagamentos, setPagamentos] = useState<ITitulo[]>([]);
    const [valorRestante, setValorRestante] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);

    // Efeitos
    useEffect(() => {
        buscarClientes();
        buscarProdutos();
        buscarFormasPagamento();

        if (order) {
            setClient(order.client);
            setItems(order.items);
            setPagamentos(order.titulos || []);
            setObservacao(order.observacao || '');
            setDiscount(order.discount || 0);
        }
    }, [order]);

    useEffect(() => {
        const totalPedido = calcularTotal();
        setValorRestante(totalPedido);
    }, [items]);

    useEffect(() => {
        atualizarValorRestante();
    }, [pagamentos]);

    // Funções de Cálculo
    const calcularSubtotal = () => {
        const subtotal = items.reduce((total, item) => {
            const preco = item.unitPrice || 0;
            const quantidade = item.quantity || 0;
            return total + (preco * quantidade);
        }, 0);
        console.log(subtotal)
        return subtotal;
    }

    const calcularTotal = () => {
        const subtotal = calcularSubtotal();
        return subtotal - discount;
    }

    const atualizarValorRestante = () => {
        const totalPedido = calcularTotal();
        const totalPago = pagamentos.reduce((acc, curr) => acc + (curr.valorParcelas || 0), 0);
        setValorRestante(totalPedido - totalPago);
    };

    // Funções de Produto
    const adicionarProduto = (produtoSelecionado: IProduct) => {
        // Check if product is already in items
        const produtoExistente = items.find(item => item.product.id === produtoSelecionado.id);
        if (produtoExistente) {
            toast({
                variant: "destructive",
                title: "Produto já selecionado",
                description: "Este produto já foi adicionado ao pedido."
            });
            return;
        }

        const novoItem: IOrderItem = {
            product: produtoSelecionado,
            quantity: 1,
            unitPrice: produtoSelecionado.price,
        };
        setItems(prevItems => [...prevItems, novoItem]);
        setSelectedProducts(prev => [...prev, produtoSelecionado]);
    };

    const atualizarQuantidadeProduto = (item: IOrderItem, e: React.ChangeEvent<HTMLInputElement>) => {
        const novaQuantidade = e.target.value ? parseInt(e.target.value) : 1;
        setItems(prev =>
            prev.map(prevItem =>
                prevItem.product.id === item.product.id
                    ? { ...prevItem, quantity: novaQuantidade }
                    : prevItem
            )
        );
    }

    const removerProduto = (itemParaRemover: IOrderItem) => {
        setItems(prev => prev.filter(item => item.product.id !== itemParaRemover.product.id));
        setSelectedProducts(prev => prev.filter(produto => produto.id !== itemParaRemover.product.id));
    }

    // Funções de Pagamento
    const adicionarFormaPagamento = (formaPagamentoId: string) => {
        const forma = formasPagamento.find(f => String(f.id) === formaPagamentoId);
        if (forma) {
            const pagamentoExistente = pagamentos.find(p => p.formaPagamento.id === forma.id);
            if (pagamentoExistente) {
                toast({
                    variant: "destructive",
                    title: "Forma de pagamento já selecionada",
                    description: "Esta forma de pagamento já foi adicionada ao pedido."
                });
                return;
            }

            const valorInicial = pagamentos.length === 0 ? valorRestante : 0;

            const novoPagamento: ITitulo = {
                formaPagamento: forma,
                numeroParcelas: 1,
                valorParcelas: valorInicial,
                idPedido: order?.id ?? 0,
                geradoNoCaixa: false,
            };
            setPagamentos(prev => [...prev, novoPagamento]);
        }
    };

    const atualizarParcelasPagamento = (index: number, novoValorParcelas: number) => {
        const novosPagamentos = [...pagamentos];
        novosPagamentos[index].numeroParcelas = novoValorParcelas;
        setPagamentos(novosPagamentos);
    };

    const atualizarValorPagamento = (index: number, novoValor: number) => {
        const novosPagamentos = [...pagamentos];
        novosPagamentos[index].valorParcelas = novoValor;
        setPagamentos(novosPagamentos);
        atualizarValorRestante();
    };

    const removerPagamento = (index: number) => {
        setPagamentos(prev => prev.filter((_, i) => i !== index));
        atualizarValorRestante();
    };

    // Funções de Navegação
    const voltarParaLista = () => {
        setOrder(null)
        navigate('/orders')
    }

    // Funções de API
    const buscarClientes = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/client', {
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
                return;
            }

            setClients(await response.json());
        } catch (err: unknown) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao buscar clientes. Tente novamente ou contate o suporte."
            });
        }
    };

    const buscarProdutos = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/product', {
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

            const produtos = await response.json();
            console.log('Produtos recebidos:', produtos);
            setProducts(produtos);
        } catch (err: unknown) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao buscar produtos. Tente novamente ou contate o suporte."
            });
        }
    };

    const buscarFormasPagamento = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/forma-pagamento', {
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
                    title: "Erro ao buscar formas de pagamento",
                    description: errorData.details,
                });
                return;
            }

            setFormasPagamento(await response.json());
        } catch (err: unknown) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao buscar formas de pagamento. Tente novamente ou contate o suporte."
            });
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!client) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Campo cliente é obrigatório."
            });
            return;
        }

        // Calculando valor total do pedido e total dos pagamentos
        const valorTotalPedido = calcularTotal();
        const valorTotalPagamentos = pagamentos.reduce((acc, curr) => acc + (curr.valorParcelas || 0), 0);

        // Verificando se os valores são iguais (com margem de erro de 0.01 para evitar problemas com decimais)
        console.log((valorTotalPedido + discount))
        console.log(valorTotalPagamentos)

        if ((valorTotalPedido + discount) - valorTotalPagamentos > 0.01) {
            if (valorTotalPagamentos < valorTotalPedido + discount) {
                toast({
                    variant: "destructive",
                    title: "Erro no pagamento",
                    description: "O valor total das formas de pagamento é menor que o valor do pedido."
                });
                return;
            }
            if (valorTotalPagamentos > valorTotalPedido + discount) {
                toast({
                    variant: "destructive",
                    title: "Erro no pagamento",
                    description: "O valor total das formas de pagamento é maior que o valor do pedido."
                });
                return;
            }
        }

        const dadosPedido: IOrder = {
            client,
            enumStatus: "PENDING",
            items,
            titulos: pagamentos,
            observacao: observacao,
            totalValue: valorTotalPedido,
            discount: discount
        };

        order ? atualizarPedido(dadosPedido) : cadastrarPedido(dadosPedido);
    };

    const finalizarSubmissao = () => {
        setOrder(null);
        navigate('/orders');
    }

    const cadastrarPedido = async (dadosPedido: IOrder) => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(dadosPedido),
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

            toast({
                variant: "default",
                title: "Sucesso!",
                description: "Cadastro realizado com sucesso."
            });
            finalizarSubmissao();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao cadastrar. Tente novamente ou contate o suporte."
            });
        }
    }

    const atualizarPedido = async (dadosPedido: IOrder) => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/order', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(order ? order.id : 0)
                },
                body: JSON.stringify(dadosPedido)
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

            toast({
                variant: "default",
                title: "Sucesso!",
                description: "Atualização realizada com sucesso."
            });
            finalizarSubmissao();
        } catch (err: unknown) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao atualizar. Tente novamente ou contate o suporte."
            });
        }
    };

    const excluirPedido = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/order', {
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
                    title: "Erro ao excluir pedido",
                    description: errorData.details,
                });
                return;
            }

            toast({
                variant: "default",
                title: "Sucesso!",
                description: "Exclusão realizada com sucesso."
            });
            finalizarSubmissao();
        } catch (err: unknown) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao excluir. Tente novamente ou contate o suporte."
            });
        }
    };

    return (
        <section className='container w-3/4 mx-auto my-8 flex flex-col gap-y-10 min-h-screen pb-16'>
            <header className="flex justify-between items-center">
                <h3>Cadastro de Pedido</h3>
                {order && admin && (
                    <Button variant='destructive' onClick={excluirPedido}>
                        Excluir Pedido
                    </Button>
                )}
            </header>

            <form onSubmit={handleSubmit} className='flex flex-col gap-y-10'>
                {/* Seção Cliente */}
                <section className="border p-4 rounded-lg">
                    <h4 className="mb-4">Dados do Cliente</h4>
                    <div>
                        <Label htmlFor="client">Cliente:</Label>
                        <Select
                            value={client?.id ? String(client.id) : ""}
                            onValueChange={(value) => {
                                const clienteSelecionado = clients?.find((cli) => String(cli.id) === value);
                                if (clienteSelecionado) setClient(clienteSelecionado);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {clients && clients.map((cli) => (
                                        <SelectItem
                                            key={cli.id}
                                            value={String(cli.id)}
                                        >
                                            {cli.name} - {cli.document}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                {/* Seção Produtos */}
                <section className="border p-4 rounded-lg">
                    <h4 className="mb-4">Seleção de Produtos</h4>
                    <div className="mb-4 w-full">
                        <Label htmlFor="products">Adicionar Produto:</Label>
                        <ProductCombobox
                            products={products}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            handleSelectProduct={adicionarProduto}
                        />
                    </div>

                    <Table>
                        <TableCaption>Produtos Selecionados</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-1/12 text-center'>Imagem</TableHead>
                                <TableHead className='w-3/12 text-left'>Nome</TableHead>
                                <TableHead className='w-2/12 text-right'>Quantidade</TableHead>
                                <TableHead className='w-3/12 text-right'>Preço Unitário (R$)</TableHead>
                                <TableHead className='w-2/12 text-right'>Total (R$)</TableHead>
                                <TableHead className='w-1/12 text-center'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.product.id}>
                                    <TableCell className='text-center'>
                                        <img src={item.product.image} alt={item.product.name} />
                                    </TableCell>
                                    <TableCell className='text-left'>{item.product.name}</TableCell>
                                    <TableCell className='text-right'>
                                        <Input
                                            className='text-right'
                                            maxLength={10}
                                            value={item.quantity}
                                            onChange={(e) => atualizarQuantidadeProduto(item, e)}
                                        />
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        {item.unitPrice.toFixed(2).replace('.', ',')}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        {(item.quantity * item.unitPrice).toFixed(2).replace('.', ',')}
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Button
                                            variant='destructive'
                                            className='w-10/12'
                                            onClick={() => removerProduto(item)}
                                        >
                                            Remover
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className='text-left' colSpan={3}>
                                    Total de Itens: {items.length}
                                </TableCell>
                                <TableCell className='text-right' colSpan={3}>
                                    Subtotal: R$ {calcularSubtotal().toFixed(2).replace('.', ',')}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </section>

                {/* Seção Pagamento */}
                <section className="border p-4 rounded-lg">
                    <div className='flex justify-between items-center mb-4'>
                        <h4>Formas de Pagamento</h4>
                        <p>Valor Restante: R$ {valorRestante.toFixed(2).replace('.', ',')}</p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        <div>
                            <Label>Forma de Pagamento:</Label>
                            <Select onValueChange={adicionarFormaPagamento}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {formasPagamento.map((forma) => (
                                            <SelectItem key={forma.id} value={String(forma.id)}>
                                                {forma.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableCaption>Formas de Pagamento Selecionadas</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Forma de Pagamento</TableHead>
                                <TableHead>Parcelas</TableHead>
                                <TableHead>Valor (R$)</TableHead>
                                <TableHead>Valor por Parcela (R$)</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pagamentos.map((pagamento, index) => (
                                <TableRow key={index}>
                                    <TableCell>{pagamento.formaPagamento.nome}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={String(pagamento.numeroParcelas)}
                                            onValueChange={(value) => atualizarParcelasPagamento(index, Number(value))}
                                            disabled={pagamento.formaPagamento.numeroMaxParcelas === 1}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from(
                                                    { length: pagamento.formaPagamento.numeroMaxParcelas },
                                                    (_, i) => i + 1
                                                ).map((num) => (
                                                    <SelectItem key={num} value={String(num)}>
                                                        {num}x
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={pagamento.valorParcelas}
                                            onChange={(e) => atualizarValorPagamento(index, Number(e.target.value))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {pagamento.numeroParcelas > 0
                                            ? (pagamento.valorParcelas / pagamento.numeroParcelas).toFixed(2).replace('.', ',')
                                            : '0,00'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            onClick={() => removerPagamento(index)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Remover
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
                {/* Nova Seção de Observação */}
                <section className="border p-4 rounded-lg">
                    <h4 className="mb-4">Observação</h4>
                    <div>
                        <Label htmlFor="observacao">Observação do Pedido:</Label>
                        <textarea
                            id="observacao"
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            value={observacao}
                            onChange={(e) => setObservacao(e.target.value)}
                            placeholder="Digite uma observação para o pedido..."
                        />
                    </div>
                </section>
                {/* Seção Final de Resumo do Pedido */}
                <section className="border p-4 rounded-lg">
                    <h4 className="mb-4">Resumo do Pedido</h4>
                    <div>
                        <Label htmlFor="discount">Desconto (R$):</Label>
                        <Input
                            type="number"
                            id="discount"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                            placeholder="Digite o valor do desconto"
                        />
                    </div>
                    <div className="mt-4">
                        <p>Subtotal: R$ {calcularSubtotal().toFixed(2).replace('.', ',')}</p>
                        <p>Total: R$ {calcularTotal().toFixed(2).replace('.', ',')}</p>
                    </div>
                </section>
                <div className='flex flex-col md:flex-row gap-4 mt-4'>
                    <Button
                        className='md:w-1/4 order-2 md:order-1 bg-red-600 hover:bg-red-700 text-white'
                        onClick={voltarParaLista}
                    >
                        Voltar para Lista
                    </Button>
                    <Button
                        className='md:w-3/4 order-1 md:order-2 bg-zinc-900 hover:bg-zinc-800 text-white'
                        variant='default'
                    >
                        {order ? 'Atualizar Pedido' : 'Cadastrar Pedido'}
                    </Button>
                </div>
            </form>
        </section>
    );
}