import { ISupplier } from '@/@types/ISupplier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplier } from '@/context/SupplierContext';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupplierCadaster() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [active, setActive] = useState(true);
    const { supplier, setSupplier } = useSupplier();

    const navigate = useNavigate();

    const returnToList = () => {
        setSupplier(null)
        navigate('/suppliers')
    }

    useEffect(() => {
        if (supplier) {
            setName(supplier.name);
            setDocument(supplier.document);
            setContact(supplier.contact);
            setAddress(supplier.address);
            setActive(supplier.active);
        }
    }, [supplier]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const supplierData: ISupplier = {
            name,
            document,
            contact,
            address,
            active,
        };

        supplier ? updateSupplier(supplierData) : registerSupplier(supplierData)
    };

    const handleExecuteSucessSubmit = () => {
        setSupplier(null);
        navigate('/suppliers');
    };


    const registerSupplier = async (supplierDataToRegister: ISupplier) => {
        try {
            const response = await fetch('https://localhost:8443/api/v1/supplier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(supplierDataToRegister),
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
            handleExecuteSucessSubmit();

            toast({ variant: "default", title: "Sucesso!", description: "Cadastro realizado com sucesso." });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao cadastrar. Ocorreu um erro ao deletar. Tente novamente ou contate o suporte." });
        }
    }

    const updateSupplier = async (supplierDataToUpdate: ISupplier) => {

        try {
            const response = await fetch('https://localhost:8443/api/v1/supplier', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(supplier ? supplier.id : 0)
                },
                body: JSON.stringify(supplierDataToUpdate)
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

    const deleteSupplier = async () => {

        try {
            const response = await fetch('https://localhost:8443/api/v1/supplier', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(supplier ? supplier.id : 0)
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

            toast({ variant: "default", title: "Sucesso!", description: "Deletar realizado com sucesso." });

            handleExecuteSucessSubmit();

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao deletar. Tente novamente ou contate o suporte." }); 
        }
    };

    return (
        <section id='suppliers' className='container w-3/4 mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10'>
            <header>
                <h3>Cadastro de Fornecedor</h3>
                {supplier &&
                    <div className='flex justify-end'>
                        <Button variant='destructive'
                            onClick={deleteSupplier}>
                            Excluir
                        </Button>
                    </div>
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
                            onChange={(e) => setDocument(e.target.value)} />
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
                    <Button className='md:w-1/4 order-2 md:order-1' variant='destructive'
                        onClick={() => returnToList()}>
                        Voltar para lista</Button>
                    <Button className='md:w-3/4 order-1 md:order-2' variant='default'>{supplier ? 'Atualizar Fornecedor' : 'Cadastrar'}</Button>
                </div>
            </form>
        </section>
    )
}