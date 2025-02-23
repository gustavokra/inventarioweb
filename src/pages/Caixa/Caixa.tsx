import { IOperacaoCaixa } from '@/@types/ICaixa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCaixa } from '@/context/CaixaContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function Caixa() {
    const { operacaoAtual, setOperacaoAtual, estaAberto } = useCaixa();
    const { toast } = useToast();
    const [saldoInicial, setSaldoInicial] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const handleAbrirCaixa = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/caixa/abrir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    saldoInicial: Number(saldoInicial),
                    observacoes
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao abrir caixa",
                    description: errorData.details,
                });
                return;
            }

            const data = await response.json();
            setOperacaoAtual(data);
            toast({
                title: "Sucesso",
                description: "Caixa aberto com sucesso!",
            });
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao abrir o caixa.",
            });
        }
    };

    const handleFecharCaixa = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/v1/caixa/${operacaoAtual?.id}/fechar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    observacoes
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao fechar caixa",
                    description: errorData.details,
                });
                return;
            }

            setOperacaoAtual(null);
            toast({
                title: "Sucesso",
                description: "Caixa fechado com sucesso!",
            });
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro ao fechar o caixa.",
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Controle de Caixa</h1>

                {!estaAberto ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Saldo Inicial (R$)
                            </label>
                            <Input
                                type="number"
                                value={saldoInicial}
                                onChange={(e) => setSaldoInicial(e.target.value)}
                                placeholder="0,00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Observações
                            </label>
                            <Input
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                placeholder="Observações sobre a abertura do caixa"
                            />
                        </div>
                        <Button
                            onClick={handleAbrirCaixa}
                            className="w-full"
                            disabled={!saldoInicial}
                        >
                            Abrir Caixa
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-700">Saldo Inicial</h3>
                                <p className="text-2xl font-bold">
                                    R$ {operacaoAtual?.saldoInicial.toFixed(2)}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-700">Total Vendas</h3>
                                <p className="text-2xl font-bold">
                                    R$ {operacaoAtual?.totalVendas?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Observações para Fechamento
                                </label>
                                <Input
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    placeholder="Observações sobre o fechamento do caixa"
                                />
                            </div>
                            <Button
                                onClick={handleFecharCaixa}
                                variant="destructive"
                                className="w-full"
                            >
                                Fechar Caixa
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 