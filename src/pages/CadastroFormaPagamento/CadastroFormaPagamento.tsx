import { IFormaPagamento } from '@/@types/IFormaPagamento';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormaPagamento } from '@/context/FormaPagamentoContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CadastroFormaPagamento() {
    const { toast } = useToast();
    const [nome, setNome] = useState('');
    const [numeroMaxParcelas, setNumeroMaxParcelas] = useState(1);
    const admin = localStorage.getItem('admin') === 'true';
    const { formaPagamento, setFormaPagamento } = useFormaPagamento();

    const navigate = useNavigate();

    const returnToList = () => {
        setFormaPagamento(null)
        navigate('/forma-pagamento')
    }

    useEffect(() => {
        if (formaPagamento) {
            setNome(formaPagamento.nome);
            setNumeroMaxParcelas(formaPagamento.numeroMaxParcelas);
        }
    }, [formaPagamento]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formaPagamentoData: IFormaPagamento = { nome, numeroMaxParcelas };
        formaPagamento ? updateFormaPagamento(formaPagamentoData) : registerFormaPagamento(formaPagamentoData);
    };

    const handleExecuteSucessSubmit = () => {
        setFormaPagamento(null);
        navigate('/forma-pagamento');
    };

    const registerFormaPagamento = async (formaPagamentoDataToRegister: IFormaPagamento) => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/forma-pagamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(formaPagamentoDataToRegister),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao cadastrar forma de pagamento",
                    description: errorData.details,
                });
                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Cadastro realizado com sucesso." });
            handleExecuteSucessSubmit();

        } catch (error) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao cadastrar. Tente novamente ou contate o suporte." });
        }
    };

    const updateFormaPagamento = async (formaPagamentoDataToUpdate: IFormaPagamento) => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/forma-pagamento', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(formaPagamento ? formaPagamento.id : 0)
                },
                body: JSON.stringify(formaPagamentoDataToUpdate)
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
            handleExecuteSucessSubmit();

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao atualizar. Tente novamente ou contate o suporte." });
        }
    };

    const deleteFormaPagamento = async () => {
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/forma-pagamento', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(formaPagamento ? formaPagamento.id : 0)
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao deletar",
                    description: errorData.details,
                });
                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Remoção realizada com sucesso." });
            handleExecuteSucessSubmit();

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao deletar. Tente novamente ou contate o suporte." });
        }
    };

    return (
        <section id='forma-pagamento' className='container w-3/4 mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10'>
            <header>
                <h3>Cadastro de Forma de Pagamento</h3>
                {formaPagamento && admin &&
                    <div className='flex justify-end'>
                        <Button variant='destructive' onClick={deleteFormaPagamento}>
                            Excluir
                        </Button>
                    </div>
                }
            </header>

            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <Label htmlFor='nome'>Nome:</Label>
                        <Input 
                            id='nome' 
                            type='text' 
                            className='w-full' 
                            placeholder='Digite o nome'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)} 
                        />
                    </div>
                    <div>
                        <Label htmlFor='numeroMaxParcelas'>Número Máximo de Parcelas:</Label>
                        <Input 
                            id='numeroMaxParcelas' 
                            type='number' 
                            min="1"
                            className='w-full' 
                            placeholder='Digite o número máximo de parcelas'
                            value={numeroMaxParcelas}
                            onChange={(e) => setNumeroMaxParcelas(Number(e.target.value))} 
                        />
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-4 mt-4'>
                    <Button 
                        className='md:w-1/4 order-2 md:order-1 bg-red-600 hover:bg-red-700 text-white' 
                        onClick={returnToList}
                    >
                        Voltar para lista
                    </Button>
                    <Button 
                        className='md:w-3/4 order-1 md:order-2 bg-zinc-900 hover:bg-zinc-800 text-white' 
                        variant='default'
                    >
                        {formaPagamento ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                </div>
            </form>
        </section>
    );
}
