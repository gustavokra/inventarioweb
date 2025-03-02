import { ISupplier } from '@/@types/ISupplier';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSupplier } from '@/context/SupplierContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupplierList() {
    const { toast } = useToast();
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [documentFilter, setDocumentFilter] = useState<string>('');
    const [reload, setReload] = useState(false);
    const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');
    const admin = localStorage.getItem('admin') === 'true';
    const { setSupplier } = useSupplier();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://35.198.61.242:8443/api/v1/supplier', {
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
                        title: "Erro ao trazer dados",
                        description: errorData.details,
                    });
                    return;
                }
                setSuppliers(await response.json());
            } catch (err: unknown) {
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao trazer dados." });
            }
        };

        fetchData();
    }, [reload]);

    const handleCadaster = () => {
        navigate('/suppliers/cadaster');
    };

    const handleEdit = (supplier: ISupplier) => {
        setSupplier(supplier);
        navigate('/suppliers/cadaster');
    }

    const handleChangeStatus = async (supplier: ISupplier) => {
        const newSupplierActiveStatus = !supplier.active

        const supplierDataToUpdate = {
            active: newSupplierActiveStatus
        }

        try {
            const response = await fetch('https://35.198.61.242:8443/api/v1/supplier', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(supplier.id)
                },
                body: JSON.stringify(supplierDataToUpdate)
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar status",
                    description: errorData.details,
                });
                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Mudança de status realizada com sucesso." });
            setReload((prev) => !prev);
        } catch (err: unknown) {
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Erro ao mudar status. Tente novamente ou contate o suporte."
            });
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        supplier.document.includes(documentFilter)
    );

    const sortSuppliersByName = (order: 'asc' | 'desc') => {
        const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
            if (order === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        return sortedSuppliers;
    };
    const sortedSuppliers = sortSuppliersByName(nameSortOrder);

    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Fornecedores</h1>
                    {admin && (
                        <Button 
                            onClick={handleCadaster}
                            className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors'
                        >
                            Cadastrar Fornecedor
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <label htmlFor='name-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por Nome
                        </label>
                        <Input
                            id='name-filter'
                            type='text'
                            placeholder='Digite o nome'
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='document-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por CPF/CNPJ
                        </label>
                        <Input
                            id='document-filter'
                            type='text'
                            placeholder='Digite o CPF/CNPJ'
                            value={documentFilter}
                            onChange={(e) => setDocumentFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                </div>

                {/* Table */}
                <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
                    <Table>
                        <TableCaption>Lista de fornecedores cadastrados</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50'>
                                <TableHead 
                                    className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100'
                                    onClick={() => setNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    Nome {nameSortOrder === 'asc' ? '↑' : '↓'}
                                </TableHead>
                                <TableHead className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>CPF/CNPJ</TableHead>
                                <TableHead className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Contato</TableHead>
                                <TableHead className='w-3/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Endereço</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ativo</TableHead>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedSuppliers.map((supplier) => (
                                <TableRow 
                                    key={supplier.document}
                                    className='hover:bg-gray-50 transition-colors'
                                >
                                    <TableCell className='py-3 px-4'>{supplier.name}</TableCell>
                                    <TableCell className='py-3 px-4'>{supplier.document}</TableCell>
                                    <TableCell className='py-3 px-4'>{supplier.contact}</TableCell>
                                    <TableCell className='py-3 px-4'>{supplier.address}</TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center'>
                                            <StatusLabel
                                                isPrimary={supplier.active}
                                                primaryText='Sim'
                                                secondText='Não'
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center gap-2'>
                                            <Button 
                                                variant='destructive' 
                                                onClick={() => handleChangeStatus(supplier)}
                                                className='px-3 py-1 text-xs'
                                            >
                                                {supplier.active ? 'Desativar' : 'Ativar'}
                                            </Button>
                                            {admin && (
                                                <Button 
                                                    variant='outline'
                                                    onClick={() => handleEdit(supplier)}
                                                    className='px-3 py-1 text-xs text-gray-900 hover:text-gray-900 border-gray-200'
                                                >
                                                    Editar
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={5} className='py-3 px-4 text-sm font-medium'>
                                    Total de Fornecedores
                                </TableCell>
                                <TableCell className='py-3 px-4 text-sm font-medium text-right'>
                                    {filteredSuppliers.length}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </section>
    );
}
