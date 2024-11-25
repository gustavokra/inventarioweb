import { ISupplier } from '@/@types/ISupplier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupplier } from '@/context/SupplierContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupplierCadaster() {
    const [id, setId] = useState(0);
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
            setId(supplier.id ? supplier.id : 0)
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
        setSupplier(null);
        navigate('/suppliers');
    };

    const registerSupplier = async (supplierDataToRegister: ISupplier) => {
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/supplier', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(supplierDataToRegister),
            });

            if (!response.ok) {
                console.log(response.status)
                throw new Error(`Erro: ${response.status}`);
            }

        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
        }
    }

    const updateSupplier = async (supplierDataToUpdate: ISupplier) => {

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/supplier', {
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
                throw new Error('Erro atualizar fornecedor');
            }

        } catch (err: unknown) {
            console.log(err);
        }
    };

    const deleteSupplier = async () => {

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/supplier', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(supplier ? supplier.id : 0)
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar fornecedor');
            }

            navigate('/suppliers');

        } catch (err: unknown) {
            console.log(err);
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