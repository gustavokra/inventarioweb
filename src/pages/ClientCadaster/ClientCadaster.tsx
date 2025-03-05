import { IClient } from '@/@types/IClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useClient } from '@/context/ClientContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientCadaster() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [active, setActive] = useState(true);
    const admin = localStorage.getItem('admin') === 'true';
    const { client, setClient } = useClient();

    const navigate = useNavigate();

    const returnToList = () => {
        setClient(null)
        navigate('/clients')
    }

    useEffect(() => {
        if (client) {
            setName(client.name);
            setDocument(client.document);
            setContact(client.contact);
            setAddress(client.address);
            setActive(client.active);
        }
    }, [client]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const clientData: IClient = { name, document, contact, address, active };
        client ? updateClient(clientData) : registerClient(clientData, toast);
    };

    const handleExecuteSucessSubmit = () => {
        setClient(null);
        navigate('/clients');
    };

    const registerClient = async (clientDataToRegister: IClient, toast: any) => {
        try {
            const response = await fetch('https://inventario-web-ptax.onrender.com/api/v1/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(clientDataToRegister),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao cadastrar cliente",
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

    const updateClient = async (clientDataToUpdate: IClient) => {

        try {
            const response = await fetch('https://inventario-web-ptax.onrender.com/api/v1/client', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(client ? client.id : 0)
                },
                body: JSON.stringify(clientDataToUpdate)
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

    const deleteClient = async () => {

        try {
            const response = await fetch('https://inventario-web-ptax.onrender.com/api/v1/client', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(client ? client.id : 0)
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
            handleExecuteSucessSubmit();

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao deletar. Tente novamente ou contate o suporte." }); 
        }
    };

    return (
        <section id='clients' className='container w-3/4 mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10'>
            <header>
                <h3>Cadastro de cliente</h3>
                {client &&
                    admin ?
                    <div className='flex justify-end'>
                        <Button variant='destructive'
                            onClick={deleteClient}>
                            Excluir
                        </Button>
                    </div>
                    : null
                }

            </header>

            <form onSubmit={handleSubmit}>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <Label htmlFor='name'>Nome:</Label>
                        <Input id='name' type='text' className='w-full' placeholder='Digite seu nome'
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor='cpf_cnpj'>CPF/CNPJ:</Label>
                        <Input id='cpf_cnpj' type='text' className='w-full' placeholder='Digite seu cpf ou cnpj'
                            value={document}
                            onChange={(e) => {
                                setDocument(e.target.value)
                            }} />
                    </div>
                    <div className='md:col-span-2'>
                        <Label htmlFor='contato'>Contato:</Label>
                        <Input id='contato' type='text' className='w-full' placeholder='Digite seu contato'
                            value={contact}
                            onChange={(e) => setContact(e.target.value)} />
                    </div>
                    <div className='md:col-span-2'>
                        <Label htmlFor='endereco'>Endereço:</Label>
                        <Input id='endereco' type='text' className='w-full' placeholder='Digite seu endereço'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
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
                        {client ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                </div>
            </form>
        </section>
    )
}