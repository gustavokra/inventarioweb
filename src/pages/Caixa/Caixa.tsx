import { IOperacaoCaixa } from '@/@types/ICaixa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCaixa } from '@/context/CaixaContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Caixa() {
    const { operacaoAtual, setOperacaoAtual, estaAberto } = useCaixa();
    const { toast } = useToast();
    const [saldoInicial, setSaldoInicial] = useState(operacaoAtual?.saldoInicial?.toString() || '');
    const [saldoFinal, setSaldoFinal] = useState('');
    const [observacoes, setObservacoes] = useState(operacaoAtual?.observacoes || '');
    const navigate = useNavigate();

    const handleAbrirCaixa = async () => {
        try {
            const novaOperacao: Partial<IOperacaoCaixa> = {
                dataAbertura: new Date().toISOString().split('.')[0],
                saldoInicial: Number(parseFloat(saldoInicial).toFixed(2)),
                situacao: 'ABERTO',
                observacoes: observacoes || undefined,
                usuarioId: Number(localStorage.getItem('userId'))
            };

            const response = await fetch('http://localhost:8080/api/v1/operacao-caixa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'dbImpl': 'SQLITE'
                },
                body: JSON.stringify(novaOperacao)
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao abrir caixa",
                    description: errorData.details || JSON.stringify(errorData),
                });
                return;
            }

            const data: IOperacaoCaixa = await response.json();
            setOperacaoAtual(data);
            navigate('/lista-caixa');

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
        if (!saldoFinal) {
            toast({
                variant: "destructive",
                title: "Erro ao fechar caixa",
                description: "O saldo final é obrigatório",
            });
            return;
        }

        try {
            const dadosFechamento: Partial<IOperacaoCaixa> = {
                dataFechamento: new Date().toISOString().split('.')[0],
                observacoes,
                situacao: 'FECHADO',
                saldoInicial: Number(parseFloat(saldoInicial).toFixed(2)),
                saldoFinal: Number(parseFloat(saldoFinal).toFixed(2)),
                totalMovimentado: Number(parseFloat(saldoInicial).toFixed(2)) - Number(parseFloat(saldoFinal).toFixed(2))
            };

            const response = await fetch('https://35.198.61.242:8080/api/v1/operacao-caixa', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'dbImpl': 'SQLITE',
                    'id': operacaoAtual?.id?.toString() || ''
                },
                body: JSON.stringify(dadosFechamento)
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
            navigate('/lista-caixa');
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
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {operacaoAtual ? 'Fechar Caixa' : 'Abrir Caixa'}
                    </h1>
                    <Button
                        variant="outline"
                        onClick={() => {
                            navigate('/lista-caixa');
                        }}
                        className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-colors"
                    >
                        Voltar
                    </Button>
                </div>

                {!estaAberto && !operacaoAtual ? (
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
                                min="0"
                                step="0.01"
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
                                maxLength={255}
                            />
                        </div>
                        <Button
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
                            onClick={handleAbrirCaixa}
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
                                <Input
                                    type="number"
                                    value={saldoInicial}
                                    onChange={(e) => setSaldoInicial(e.target.value)}
                                    placeholder="0,00"
                                    min="0"
                                    step="0.01"
                                    className="mt-2"
                                />
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium text-gray-700">Total Movimentado</h3>
                                <p className="text-2xl font-bold">
                                    R$ {(Number(saldoInicial || 0) - (Number(saldoFinal) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {operacaoAtual?.situacao === 'ABERTO' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Saldo Final (R$)
                                    </label>
                                    <Input
                                        type="number"
                                        value={saldoFinal}
                                        onChange={(e) => setSaldoFinal(e.target.value)}
                                        placeholder="0,00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Observações
                                </label>
                                <Input
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    placeholder={`Observações`}
                                    maxLength={255}
                                />
                            </div>
                            {operacaoAtual?.situacao === 'ABERTO' && (
                                <Button
                                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
                                    onClick={handleFecharCaixa}
                                >
                                    Fechar Caixa
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 