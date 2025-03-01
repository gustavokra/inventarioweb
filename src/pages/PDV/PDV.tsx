import { IOperacaoCaixa } from '@/@types/ICaixa';
import { IClient } from '@/@types/IClient';
import { IFormaPagamento } from '@/@types/IFormaPagamento';
import { IItemPDV } from '@/@types/IPDV';
import { IProduct } from '@/@types/IProduct';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { ProductCombobox } from '@/components/ProductComboBox';
import { ClientCombobox } from '@/components/ClientComboBox';
import { Label } from '@/components/ui/label';

export default function PDV() {
    const { toast } = useToast();
    const [itens, setItens] = useState<IItemPDV[]>([]);
    const [subtotal, setSubtotal] = useState(0);
    const [desconto, setDesconto] = useState(0);
    const [total, setTotal] = useState(0);
    const [caixaAberto, setCaixaAberto] = useState<IOperacaoCaixa | null>(null);
    const [operacoes, setOperacoes] = useState<IOperacaoCaixa[]>([]);
    const [formasPagamento, setFormasPagamento] = useState<IFormaPagamento[]>([]);
    const [pagamentosSelecionados, setPagamentosSelecionados] = useState<{
        formaPagamento: IFormaPagamento;
        numeroParcelas: number;
        valor: number;
    }[]>([]);
    const [valorRestante, setValorRestante] = useState<number>(0);
    const [produtos, setProdutos] = useState<IProduct[]>([]);
    const [produtosSelecionados, setProdutosSelecionados] = useState<IProduct[]>([]);
    const [clientes, setClientes] = useState<IClient[]>([]);
    const [clienteSelecionado, setClienteSelecionado] = useState<IClient>();

    useEffect(() => {
        fetchOperacoes();
        fetchFormasPagamento();
        fetchProdutos();
        fetchClientes();
    }, []);

    useEffect(() => {
        const operacaoAberta = operacoes.find(op => op.situacao === 'ABERTO');
        setCaixaAberto(operacaoAberta || null);
    }, [operacoes]);

    useEffect(() => {
        const novoSubtotal = itens.reduce((acc, item) => acc + item.total, 0);
        setSubtotal(novoSubtotal);
        setTotal(novoSubtotal - desconto);
    }, [itens, desconto]);

    useEffect(() => {
        const valorTotalPago = pagamentosSelecionados.reduce((acc, pag) => acc + pag.valor, 0);
        setValorRestante(total - valorTotalPago);
    }, [total, pagamentosSelecionados]);

    const fetchClientes = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/client', {
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
                    title: "Erro ao buscar clientes",
                    description: errorData.details,
                });
                return;
            }

            const data = await response.json();
            setClientes(data);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao buscar os clientes.",
            });
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/product', {
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
                    title: "Erro ao buscar produtos",
                    description: errorData.details,
                });
                return;
            }

            const data = await response.json();
            setProdutos(data);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao buscar os produtos.",
            });
        }
    };

    const fetchFormasPagamento = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/forma-pagamento', {
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
                    title: "Erro ao buscar formas de pagamento",
                    description: errorData.details,
                });
                return;
            }

            const data = await response.json();
            setFormasPagamento(data);
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao buscar as formas de pagamento.",
            });
        }
    };

    const fetchOperacoes = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/operacao-caixa', {
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

    const handleSelectProduct = (produto: IProduct) => {
        const novoItem: IItemPDV = {
            produtoId: produto.id!,
            product: produto,
            quantidade: 1,
            valorUnitario: produto.price,
            total: produto.price
        };
        setItens(prev => [...prev, novoItem]);
    };

    const handleRemoveProduct = (index: number) => {
        setItens(prev => prev.filter((_, i) => i !== index));
        setProdutosSelecionados(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateQuantidade = (index: number, novaQuantidade: number) => {
        setItens(prev => prev.map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    quantidade: novaQuantidade,
                    total: novaQuantidade * item.valorUnitario
                };
            }
            return item;
        }));
    };

    const handleAdicionarFormaPagamento = (forma: IFormaPagamento) => {
        if (valorRestante <= 0) {
            toast({
                variant: "destructive",
                title: "Valor total já atingido",
                description: "O valor total da venda já foi distribuído entre as formas de pagamento.",
            });
            return;
        }

        setPagamentosSelecionados(prev => [...prev, {
            formaPagamento: forma,
            numeroParcelas: 1,
            valor: valorRestante
        }]);
    };

    const handleRemoverFormaPagamento = (index: number) => {
        setPagamentosSelecionados(prev => prev.filter((_, i) => i !== index));
    };

    const handleAtualizarValorPagamento = (index: number, novoValor: number) => {
        setPagamentosSelecionados(prev => prev.map((pag, i) => {
            if (i === index) {
                return { ...pag, valor: novoValor };
            }
            return pag;
        }));
    };

    const handleAtualizarParcelas = (index: number, novasParcelas: number) => {
        setPagamentosSelecionados(prev => prev.map((pag, i) => {
            if (i === index) {
                return { ...pag, numeroParcelas: novasParcelas };
            }
            return pag;
        }));
    };

    const handleFinalizarVenda = async () => {
        if (!clienteSelecionado) {
            toast({
                variant: "destructive",
                title: "Cliente não selecionado",
                description: "Por favor, selecione um cliente para finalizar a venda.",
            });
            return;
        }

        if (pagamentosSelecionados.length === 0) {
            toast({
                variant: "destructive",
                title: "Forma de pagamento não selecionada",
                description: "Por favor, selecione pelo menos uma forma de pagamento.",
            });
            return;
        }

        if (Math.abs(valorRestante) > 0.01) {
            toast({
                variant: "destructive",
                title: "Valor incorreto",
                description: "O valor total dos pagamentos deve ser igual ao valor da venda.",
            });
            return;
        }

        if (itens.length === 0) {
            toast({
                variant: "destructive",
                title: "Carrinho vazio",
                description: "Adicione produtos ao carrinho antes de finalizar a venda.",
            });
            return;
        }

        const orderItems = itens.map(item => ({
            product: item.product,
            quantity: item.quantidade,
            unitPrice: item.valorUnitario
        }));

        const titulos = pagamentosSelecionados.map(pag => ({
            formaPagamento: pag.formaPagamento,
            numeroParcelas: pag.numeroParcelas,
            valorParcelas: pag.valor / pag.numeroParcelas,
            idPedido: 0
        }));

        const pedido = {
            client: clienteSelecionado,
            enumStatus: "COMPLETED",
            items: orderItems,
            titulos: titulos,
            totalValue: total,
            discount: desconto,
            geradoNoCaixa: true
        };

        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(pedido)
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao finalizar venda",
                    description: errorData.details,
                });
                return;
            }

            toast({
                title: "Sucesso",
                description: "Venda finalizada com sucesso!",
            });

            // Limpar o estado
            setItens([]);
            setProdutosSelecionados([]);
            setClienteSelecionado(undefined);
            setPagamentosSelecionados([]);
            setDesconto(0);
            setTotal(0);
            setSubtotal(0);
            setValorRestante(0);

        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao finalizar a venda.",
            });
        }
    };

    if (!caixaAberto) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Caixa Fechado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>É necessário abrir o caixa para realizar vendas.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-12 gap-6">
                {/* Painel Esquerdo - Lista de Produtos */}
                <Card className="col-span-8">
                    <CardContent className="space-y-4 p-6">
                        {/* Seleção de Cliente */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <Label className="mb-2 block">Cliente</Label>
                            <ClientCombobox
                                clients={clientes}
                                selectedClient={clienteSelecionado}
                                setSelectedClient={setClienteSelecionado}
                            />
                        </div>

                        {/* Produtos */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Adicionar Produto</Label>
                                    <ProductCombobox
                                        products={produtos}
                                        selectedProducts={produtosSelecionados}
                                        setSelectedProducts={setProdutosSelecionados}
                                        handleSelectProduct={handleSelectProduct}
                                    />
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Produto</TableHead>
                                            <TableHead className="text-center">Qtd</TableHead>
                                            <TableHead className="text-right">Valor Unit.</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="text-center">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {itens.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.product.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantidade}
                                                        onChange={(e) => handleUpdateQuantidade(index, Number(e.target.value))}
                                                        className="w-20 text-center mx-auto"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    R$ {item.valorUnitario.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    R$ {item.total.toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleRemoveProduct(index)}
                                                    >
                                                        Remover
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Painel Direito - Resumo e Pagamento */}
                <div className="col-span-4 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo da Venda</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>R$ {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>Desconto:</span>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={desconto}
                                    onChange={(e) => setDesconto(Number(e.target.value))}
                                    className="w-24"
                                />
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span className="text-green-700">R$ {total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pagamento</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Valor Restante:</span>
                                <span className={valorRestante > 0 ? "text-yellow-600" : valorRestante < 0 ? "text-red-600" : "text-green-600 font-bold"}>
                                    R$ {valorRestante.toFixed(2)}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {pagamentosSelecionados.map((pagamento, index) => (
                                    <div key={index} className="space-y-2 border rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{pagamento.formaPagamento.nome}</span>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoverFormaPagamento(index)}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Label>Valor:</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={pagamento.valor}
                                                    onChange={(e) => handleAtualizarValorPagamento(index, Number(e.target.value))}
                                                    className="w-full"
                                                />
                                            </div>

                                            {pagamento.formaPagamento.numeroMaxParcelas > 1 && (
                                                <div className="flex items-center gap-2">
                                                    <Label>Parcelas:</Label>
                                                    <select
                                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                                        value={pagamento.numeroParcelas}
                                                        onChange={(e) => handleAtualizarParcelas(index, Number(e.target.value))}
                                                    >
                                                        {Array.from(
                                                            { length: pagamento.formaPagamento.numeroMaxParcelas },
                                                            (_, i) => i + 1
                                                        ).map((num) => (
                                                            <option key={num} value={num}>
                                                                {num}x de R$ {(pagamento.valor / num).toFixed(2)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {formasPagamento.map((forma) => (
                                    <Button
                                        key={forma.id}
                                        variant="outline"
                                        className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors"
                                        onClick={() => handleAdicionarFormaPagamento(forma)}
                                        disabled={valorRestante <= 0}
                                    >
                                        {forma.nome}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white" 
                        size="lg"
                        onClick={handleFinalizarVenda}
                        disabled={!clienteSelecionado || pagamentosSelecionados.length === 0 || itens.length === 0 || Math.abs(valorRestante) > 0.01}
                    >
                        Finalizar Venda
                    </Button>
                </div>
            </div>
        </div>
    );
} 