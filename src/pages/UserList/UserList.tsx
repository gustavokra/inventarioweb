import { IUser } from '@/@types/IUser';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserList() {
    const { toast } = useToast();
    const [users, setUsers] = useState<IUser[]>([]);
    const [nameFilter, setNameFilter] = useState<string>('');
    const [emailFilter, setEmailFilter] = useState<string>('');
    const [reload, setReload] = useState(false);
    const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');
    const admin = localStorage.getItem('admin') === 'true';
    const { setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://localhost:8443/api/v1/user', {
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
                setUsers(await response.json());
            } catch (err: unknown) {
                toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao trazer dados." });
            }
        };

        fetchData();
    }, [reload]);

    const handleCadaster = () => {
        navigate('/users/cadaster');
    };

    const handleEdit = (user: IUser) => {
        setUser(user);
        navigate('/users/cadaster');
    }

    const handleChangeStatus = async (user: IUser) => {
        const newUserActiveStatus = !user.active

        const userDataToUpdate = {
            active: newUserActiveStatus
        }

        try {
            const response = await fetch('https://localhost:8443/api/v1/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(user.id)
                },
                body: JSON.stringify(userDataToUpdate)
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

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        user.email.toLowerCase().includes(emailFilter.toLowerCase())
    );

    const sortUsersByName = (order: 'asc' | 'desc') => {
        const sortedUsers = [...filteredUsers].sort((a, b) => {
            if (order === 'asc') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        return sortedUsers;
    };
    const sortedUsers = sortUsersByName(nameSortOrder);

    return (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <h1 className='text-2xl font-bold text-gray-900'>Usuários</h1>
                    {admin && (
                        <Button 
                            onClick={handleCadaster}
                            className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors'
                        >
                            Cadastrar Usuário
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
                        <label htmlFor='email-filter' className='text-sm font-medium text-gray-700'>
                            Filtrar por Email
                        </label>
                        <Input
                            id='email-filter'
                            type='text'
                            placeholder='Digite o email'
                            value={emailFilter}
                            onChange={(e) => setEmailFilter(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-gray-700'>
                            Ordenar por Nome
                        </label>
                        <Button 
                            onClick={() => setNameSortOrder(nameSortOrder === 'asc' ? 'desc' : 'asc')}
                            variant='outline'
                            className='w-full'
                        >
                            Nome {nameSortOrder === 'asc' ? '↑' : '↓'}
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
                    <Table>
                        <TableCaption>Lista de usuários cadastrados</TableCaption>
                        <TableHeader>
                            <TableRow className='bg-gray-50'>
                                <TableHead className='w-3/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Nome</TableHead>
                                <TableHead className='w-3/12 text-left py-3 px-4 text-sm font-medium text-gray-900'>Email</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Admin</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ativo</TableHead>
                                <TableHead className='w-2/12 text-center py-3 px-4 text-sm font-medium text-gray-900'>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedUsers.map((user) => (
                                <TableRow 
                                    key={user.email}
                                    className='hover:bg-gray-50 transition-colors'
                                >
                                    <TableCell className='py-3 px-4'>{user.name}</TableCell>
                                    <TableCell className='py-3 px-4'>{user.email}</TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center'>
                                            <StatusLabel
                                                isPrimary={user.admin}
                                                primaryText='Sim'
                                                secondText='Não'
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center'>
                                            <StatusLabel
                                                isPrimary={user.active}
                                                primaryText='Sim'
                                                secondText='Não'
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className='py-3 px-4'>
                                        <div className='flex justify-center gap-2'>
                                            <Button 
                                                variant='destructive' 
                                                onClick={() => handleChangeStatus(user)}
                                                className='px-3 py-1 text-xs'
                                            >
                                                {user.active ? 'Desativar' : 'Ativar'}
                                            </Button>
                                            {admin && (
                                                <Button 
                                                    variant='outline'
                                                    onClick={() => handleEdit(user)}
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
                                <TableCell colSpan={4} className='py-3 px-4 text-sm font-medium'>
                                    Total de Usuários
                                </TableCell>
                                <TableCell className='py-3 px-4 text-sm font-medium text-right'>
                                    {filteredUsers.length}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        </section>
    );
} 