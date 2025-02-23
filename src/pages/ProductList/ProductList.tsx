import { IProduct } from '@/@types/IProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { StatusLabel } from '@/components/StatusLabel';
import { useToast } from '@/hooks/use-toast';

export default function ProductList() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { setProduct } = useProduct();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [supplierFilter, setsupplierNameFilter] = useState<string>('');
    const [sortPriceOrder, setSortPriceOrder] = useState<'asc' | 'desc'>('asc');
    const [reload, setReload] = useState(false);
    const admin = localStorage.getItem('admin') === 'true';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/product', {
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
                const data = await response.json();
                console.log('Produtos recebidos:', data);
                setProducts(data);
            } catch (err: unknown) {
                console.error('Erro ao buscar produtos:', err);
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao trazer dados." });
            }
        };

        fetchData();
    }, [reload]);

    const handleCadaster = () => {
        navigate('/products/cadaster');
    };

    const handleEdit = (product: IProduct) => {
        setProduct(product);
        navigate('/products/cadaster');
    }

    const handleChangeStatus = async (product: IProduct) => {
        const newProductActiveStatus = !product.active

        const productDataToUpdate = {
            active: newProductActiveStatus
        }

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(product.id)
                },
                body: JSON.stringify(productDataToUpdate)
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

    const filteredProducts = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchSupplier = !supplierFilter || 
            (product.supplier && product.supplier.name.toLowerCase().includes(supplierFilter.toLowerCase()));
        
        return matchName && matchSupplier;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortPriceOrder === 'asc') {
            return a.price - b.price;
        }
        return b.price - a.price;
    });

    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Produtos</h1>
                    {admin && (
                        <Button 
                            onClick={handleCadaster}
                            className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors'
                        >
                            Cadastrar Produto
                        </Button>
                    )}
                </div>

                {/* Filters */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
                        <label htmlFor='supplier-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por Fornecedor
                        </label>
                        <Input
                            id='supplier-filter'
                            type='text'
                            placeholder='Digite o fornecedor'
                            value={supplierFilter}
                            onChange={(e) => setsupplierNameFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>
                            Ordenar por Preço
                        </label>
                        <Button 
                            onClick={() => setSortPriceOrder(sortPriceOrder === 'asc' ? 'desc' : 'asc')}
                            variant='outline'
                            className='w-full'
                        >
                            Preço {sortPriceOrder === 'asc' ? '↑' : '↓'}
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
                    <Table>
                        <TableCaption>Lista de produtos cadastrados</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50'>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Imagem</TableHead>
                                <TableHead className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Nome</TableHead>
                                <TableHead className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Descrição</TableHead>
                                <TableHead className='w-1/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Preço (R$)</TableHead>
                                <TableHead className='w-1/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Quantidade</TableHead>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Marca</TableHead>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Grupo</TableHead>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Fornecedor</TableHead>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ativo</TableHead>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedProducts.map((product) => (
                                <TableRow 
                                    key={product.id}
                                    className='hover:bg-gray-50 transition-colors'
                                >
                                    <TableCell className='py-3 px-4 text-center'>
                                        {product.image ? (
                                            <img 
                                                src={product.image} 
                                                alt={product.name} 
                                                className='w-12 h-12 object-cover rounded-md inline-block' 
                                            />
                                        ) : (
                                            <div className='w-12 h-12 bg-gray-200 rounded-md inline-block'></div>
                                        )}
                                    </TableCell>
                                    <TableCell className='py-3 px-4'>{product.name}</TableCell>
                                    <TableCell className='py-3 px-4'>{product.description || '-'}</TableCell>
                                    <TableCell className='py-3 px-4 text-right'>{product.price.toFixed(2).replace('.', ',')}</TableCell>
                                    <TableCell className='py-3 px-4 text-right'>{product.quantity}</TableCell>
                                    <TableCell className='py-3 px-4'>{product.marca?.nome || '-'}</TableCell>
                                    <TableCell className='py-3 px-4'>{product.grupo?.nome || '-'}</TableCell>
                                    <TableCell className='py-3 px-4'>{product.supplier ? `${product.supplier.name} - ${product.supplier.document}` : '-'}</TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center'>
                                            <StatusLabel
                                                isPrimary={product.active}
                                                primaryText='Sim'
                                                secondText='Não'
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center gap-2'>
                                            <Button 
                                                variant='destructive' 
                                                onClick={() => handleChangeStatus(product)}
                                                className='px-3 py-1 text-xs'
                                            >
                                                {product.active ? 'Desativar' : 'Ativar'}
                                            </Button>
                                            {admin && (
                                                <Button 
                                                    variant='outline'
                                                    onClick={() => handleEdit(product)}
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
                                <TableCell colSpan={9} className='py-3 px-4 text-sm font-medium'>
                                    Total de Produtos
                                </TableCell>
                                <TableCell className='py-3 px-4 text-sm font-medium text-right'>
                                    {filteredProducts.length}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </section>
    );
}