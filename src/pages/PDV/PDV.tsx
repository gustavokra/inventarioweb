import { IItemPDV, IVendaPDV } from '@/@types/IPDV';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCaixa } from '@/context/CaixaContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function PDV() {
    const { operacaoAtual, estaAberto } = useCaixa();
    const { toast } = useToast();
    const [codigoProduto, setCodigoProduto] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [itens, setItens] = useState<IItemPDV[]>([]);
    const [total, setTotal] = useState(0);

    if (!estaAberto) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Caixa Fechado</h1>
                    <p className="mt-2">É necessário abrir o caixa para realizar vendas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-12 gap-6">
                {/* Painel Esquerdo - Lista de Produtos */}
                <div className="col-span-8 bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Código do Produto"
                                value={codigoProduto}
                                onChange={(e) => setCodigoProduto(e.target.value)}
                            />
                            <Input
                                type="number"
                                min="1"
                                value={quantidade}
                                onChange={(e) => setQuantidade(Number(e.target.value))}
                                className="w-32"
                            />
                            <Button>Adicionar</Button>
                        </div>

                        <div className="mt-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Produto</th>
                                        <th className="text-center py-2">Qtd</th>
                                        <th className="text-right py-2">Valor Unit.</th>
                                        <th className="text-right py-2">Total</th>
                                        <th className="text-center py-2">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itens.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-2">Nome do Produto</td>
                                            <td className="text-center py-2">{item.quantidade}</td>
                                            <td className="text-right py-2">
                                                R$ {item.valorUnitario.toFixed(2)}
                                            </td>
                                            <td className="text-right py-2">
                                                R$ {item.total.toFixed(2)}
                                            </td>
                                            <td className="text-center py-2">
                                                <Button variant="destructive" size="sm">
                                                    Remover
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Painel Direito - Resumo e Pagamento */}
                <div className="col-span-4 space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Resumo da Venda</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Pagamento</h2>
                        <div className="space-y-4">
                            <Button className="w-full" size="lg">
                                Dinheiro
                            </Button>
                            <Button className="w-full" size="lg">
                                Cartão
                            </Button>
                            <Button className="w-full" size="lg">
                                PIX
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 