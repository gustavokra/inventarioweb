import { IClient } from '@/@types/IClient';
import { StatusLabel } from '@/components/StatusLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient } from '../../context/ClientContext';


export default function ClientList() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [documentFilter, setdocumentFilter] = useState<string>('');
  const [reload, setReload] = useState(false);
  const { setClient } = useClient();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/v1/client', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'dbImpl': 'SQLITE',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar os dados');
        }
        setClients(await response.json());
      } catch (err: unknown) {
        console.log(err);
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
      const response = await fetch('http://127.0.0.1:8080/api/v1/client', {
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
        throw new Error('Erro ao buscar os dados');
      }

      setReload((prev) => !prev);
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
    client.document.includes(documentFilter)
  );

  return (
    <section id='client_list' className='container flex flex-col gap-4 justify-center w-10/12 mt-4 mx-auto'>
      <div className='flex justify-between mb-4'>
        <h3>Clientes</h3>
        <Button variant='default' onClick={handleCadaster}>Cadastrar</Button>
      </div>

      <div className='flex md:flex-row gap-4 w-full md:w-1/2'>
        <Input
          type='text'
          placeholder='Filtrar por Nome'
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <Input
          type='text'
          placeholder='Filtrar por CPF/CNPJ'
          value={documentFilter}
          onChange={(e) => setdocumentFilter(e.target.value)}
        />
      </div>

      <Table>
        <TableCaption>Uma lista de seus clientes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-2/12 text-left'>Nome</TableHead>
            <TableHead className='w-2/12 text-left'>CPF/CNPJ</TableHead>
            <TableHead className='w-2/12 text-left'>Contato</TableHead>
            <TableHead className='w-3/12 text-left'>Endereço</TableHead>
            <TableHead className='w-2/12 text-center'>Ativo</TableHead>
            <TableHead className='w-1/12 text-center'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.document}>
              <TableCell className='text-left'>{client.name}</TableCell>
              <TableCell className='text-left'>{client.document}</TableCell>
              <TableCell className='text-left'>{client.contact}</TableCell>
              <TableCell className='text-left'>{client.address}</TableCell>
              <TableCell className='text-center'>
                <StatusLabel
                  isPrimary={client.active}
                  primaryText='Sim'
                  secondText='Não'
                />
              </TableCell>
              <TableCell className='flex justify-center gap-3'>
                <Button variant='destructive' className='w-5/12' onClick={() => handleChangeStatus(client)}> {client.active ? 'Desativar' : 'Ativar'}</Button>
                <Button variant='default' className='w-5/12' onClick={() => handleEdit(client)}>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className='text-right'>{filteredClients.length} clientes</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </section>
  );
}
