import { IClient } from '@/@types/IClient';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../context/ClientContext';
import { useToast } from '@/hooks/use-toast';

export default function ClientList() {
  const { toast } = useToast();
  const [clients, setClients] = useState<IClient[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [documentFilter, setdocumentFilter] = useState<string>('');
  const [reload, setReload] = useState(false);
  const { setClient } = useClient();
  const navigate = useNavigate();
  const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(' http://35.198.61.242:8443/api/v1/client', {
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
        setClients(await response.json());
      } catch (err: unknown) {
        toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao trazer dados." });
      }
    };

    fetchData();
  }, [reload]);

  const handleCadaster = () => {
    navigate('/clients/cadaster');
  };

  const handleEdit = (client: IClient) => {
    setClient(client);
    navigate('/clients/cadaster');
  }

  const handleChangeStatus = async (client: IClient) => {
    const newClientActiveStatus = !client.active

    const clientDataToUpdate = {
      active: newClientActiveStatus
    }

    try {
      const response = await fetch(' http://35.198.61.242:8443/api/v1/client', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'dbImpl': 'SQLITE',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'id': String(client.id)
        },
        body: JSON.stringify(clientDataToUpdate)
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

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
    client.document.includes(documentFilter)
  );

  const sortClientsByName = (order: 'asc' | 'desc') => {
    const sortedClients = [...filteredClients].sort((a, b) => {
        if (order === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });
    return sortedClients;
  };

  const sortedClients = sortClientsByName(nameSortOrder);

  return (
    <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Clientes</h1>
          <Button 
            onClick={handleCadaster}
            className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] transition-colors'
          >
            Cadastrar Cliente
          </Button>
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
              onChange={(e) => setdocumentFilter(e.target.value)}
              className='w-full'
            />
          </div>
        </div>

        {/* Table */}
        <div className='mt-6 overflow-hidden rounded-lg border border-gray-200'>
          <Table>
            <TableCaption>Lista de clientes cadastrados</TableCaption>
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
              {sortedClients.map((client) => (
                <TableRow 
                  key={client.document}
                  className='hover:bg-gray-50 transition-colors'
                >
                  <TableCell className='py-3 px-4'>{client.name}</TableCell>
                  <TableCell className='py-3 px-4'>{client.document}</TableCell>
                  <TableCell className='py-3 px-4'>{client.contact}</TableCell>
                  <TableCell className='py-3 px-4'>{client.address}</TableCell>
                  <TableCell className='py-3 px-4'>
                    <div className='flex justify-center'>
                      <StatusLabel
                        isPrimary={client.active}
                        primaryText='Sim'
                        secondText='Não'
                      />
                    </div>
                  </TableCell>
                  <TableCell className='py-3 px-4'>
                    <div className='flex justify-center gap-2'>
                      <Button 
                        variant='destructive' 
                        onClick={() => handleChangeStatus(client)}
                        className='px-3 py-1 text-xs'
                      >
                        {client.active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button 
                        variant='outline'
                        onClick={() => handleEdit(client)}
                        className='px-3 py-1 text-xs text-gray-900 hover:text-gray-900 border-gray-200'
                      >
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className='py-3 px-4 text-sm font-medium'>
                  Total de Clientes
                </TableCell>
                <TableCell className='py-3 px-4 text-sm font-medium text-right'>
                  {filteredClients.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
}
