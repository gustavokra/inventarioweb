import { IProduct } from '@/@types/IProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import { StatusLabel } from '@/components/StatusLabel';
import { useToast } from '@/hooks/use-toast';
import FileUploadButton from '@/components/FileUploadButton';

export default function ProductList() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { setProduct } = useProduct();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [grupoFilter, setGrupoFilter] = useState<string>('');
    const [sortPriceOrder, setSortPriceOrder] = useState<'asc' | 'desc'>('asc');
    const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');
    const [reload, setReload] = useState(false);
    const admin = localStorage.getItem('admin') === 'true';
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://inventario-web-ptax.onrender.com/api/v1/product', {
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
                setProducts(data);
            } catch (err: unknown) {
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao trazer dados." });
            }
        };

        fetchData();
    }, [reload]);

    const handleCadaster = () => {
        navigate('/produtos/cadastro');
    };

    const handleEdit = (product: IProduct) => {
        setProduct(product);
        navigate('/produtos/cadastro');
    }

    const handleChangeStatus = async (product: IProduct) => {
        const newProductActiveStatus = !product.active

        const productDataToUpdate = {
            active: newProductActiveStatus
        }

        try {
            const response = await fetch('https://inventario-web-ptax.onrender.com/api/v1/product', {
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleProductsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setProductsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const filteredProducts = products.filter(product => {
        const matchName = product.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchGrupo = !grupoFilter ||
            (product.grupo && product.grupo?.nome.toLowerCase().includes(grupoFilter.toLowerCase()));

        return matchName && matchGrupo;
    });

    const sortProducts = (products: IProduct[], nameOrder: 'asc' | 'desc', priceOrder: 'asc' | 'desc') => {
        return products.sort((a, b) => {
            const nameComparison = nameOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            if (nameComparison !== 0) {
                return nameComparison;
            }
            return priceOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });
    };

    const sortedProducts = sortProducts(filteredProducts, nameSortOrder, sortPriceOrder);

    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    const getPageNumbers = () => {
        const maxPagesToShow = 10;
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
    };

    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Produtos</h1>
                    <div className='flex gap-4'>
                        {admin && (
                            <>
                            <FileUploadButton />
                            <Button
                                onClick={handleCadaster}
                            >
                                Cadastrar Produto
                            </Button>
                            </>
                        )}
                    </div>
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
                            placeholder='Digite o grupo'
                            value={grupoFilter}
                            onChange={(e) => setGrupoFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label htmlFor='products-per-page' className='text-sm font-medium text-gray-700'>
                            Produtos por página
                        </label>
                        <select
                            id='products-per-page'
                            value={productsPerPage}
                            onChange={handleProductsPerPageChange}
                            className='w-full rounded-md p-2'
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
                    <Table>
                        <TableCaption>Lista de produtos cadastrados</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50'>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Imagem</TableHead>
                                <TableHead 
                                    className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100'
                                    onClick={() => setNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    Nome {nameSortOrder === 'asc' ? '↑' : '↓'}
                                </TableHead>
                                <TableHead className='w-2/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Descrição</TableHead>
                                <TableHead className='w-1/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Custo (R$)</TableHead>
                                <TableHead 
                                    className='w-1/12 text-right py-3 px-4 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100'
                                    onClick={() => setSortPriceOrder(sortPriceOrder === 'asc' ? 'desc' : 'asc')}
                                >
                                    Preço (R$) {sortPriceOrder === 'asc' ? '↑' : '↓'}
                                </TableHead>
                                <TableHead className='w-1/12 text-right py-3 px-4 text-sm font-medium text-gray-900'>Quantidade</TableHead>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Marca</TableHead>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Grupo</TableHead>
                                <TableHead className='w-1/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Fornecedor</TableHead>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ativo</TableHead>
                                <TableHead className='w-1/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedProducts.map((product) => (
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
                                    <TableCell className='py-3 px-4 text-right'>    {product.costPrice ? product.costPrice.toFixed(2).replace('.', ',') : '-'}                                    </TableCell>
                                    <TableCell className='py-3 px-4 text-right'>{product.price?.toFixed(2).replace('.', ',')}</TableCell>
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
                                <TableCell colSpan={11} className='py-3 px-4'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-sm font-medium'>
                                            Total de Produtos: {sortedProducts.length}
                                        </span>
                                        <div className='flex items-center space-x-2'>
                                            {getPageNumbers().map((pageNumber) => (
                                                <Button
                                                    key={pageNumber}
                                                    onClick={() => handlePageChange(pageNumber)}
                                                    className={`px-3 py-1 text-xs border rounded-md ${currentPage === pageNumber ? 'bg-gray-300 text-gray-900' : 'bg-white text-gray-700'}`}
                                                >
                                                    {pageNumber}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </section>
    );
}