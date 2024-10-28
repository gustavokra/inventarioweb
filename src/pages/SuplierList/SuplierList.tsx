import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Suplier {
    nome: string;
    cpfCnpj: string;
    contato: string;
    endereco: string;
}

const initialSupliers: Suplier[] = [
    { nome: "Roberta Lima", cpfCnpj: "789.123.456-00", contato: "(71) 99876-2345", endereco: "Praça da Sé, 202 - Salvador, BA" },
    { nome: "Ana Costa", cpfCnpj: "321.654.987-00", contato: "(41) 91234-8765", endereco: "Rua Paraná, 101 - Curitiba, PR" },
    { nome: "Luiz Souza", cpfCnpj: "321.987.654-00", contato: "(81) 97654-3210", endereco: "Rua Recife, 505 - Recife, PE" },
    { nome: "Maria Oliveira", cpfCnpj: "987.654.321-00", contato: "(21) 91234-5678", endereco: "Avenida Brasil, 456 - Rio de Janeiro, RJ" },
    { nome: "Carlos Pereira", cpfCnpj: "456.789.123-00", contato: "(31) 99876-5432", endereco: "Rua Minas Gerais, 789 - Belo Horizonte, MG" },
    { nome: "João Silva", cpfCnpj: "123.456.789-00", contato: "(11) 98765-4321", endereco: "Rua das Flores, 123 - São Paulo, SP" },
    { nome: "Paulo Santos", cpfCnpj: "654.321.987-00", contato: "(51) 98765-1234", endereco: "Avenida dos Andradas, 303 - Porto Alegre, RS" },
];

export function SuplierList() {
    const [clients, setClients] = useState<Suplier[]>(initialSupliers);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [cpfCnpjFilter, setCpfCnpjFilter] = useState<string>("");
    const navigate = useNavigate();

    const handleCadaster = () => {
        navigate("/supliers/cadaster");
    };

    const handleRemove = (cpfCnpj: string) => {
        setClients(clients.filter(suplier => suplier.cpfCnpj !== cpfCnpj));
    };

    const filteredSupliers = clients.filter(suplier =>
        suplier.nome.toLowerCase().includes(nameFilter.toLowerCase()) &&
        suplier.cpfCnpj.includes(cpfCnpjFilter)
    );

    return (
        <section id="client_list" className="container flex flex-col gap-4 justify-center w-10/12 mt-4 mx-auto">
            <div className="flex justify-between mb-4">
                <h3>Fornecedores</h3>
                <Button onClick={handleCadaster}>Cadastrar</Button>
            </div>

            <div className="flex md:flex-row gap-4 w-full md:w-1/2">
            <Input
                    type="text"
                    placeholder="Filtrar por Nome"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Filtrar por CPF/CNPJ"
                    value={cpfCnpjFilter}
                    onChange={(e) => setCpfCnpjFilter(e.target.value)}
                />
            </div>

            <Table className="mx-auto my-auto">
                <TableCaption>Uma lista de seus fornecedores.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2/12 text-left">Nome</TableHead>
                        <TableHead className="w-2/12 text-left">CPF/CNPJ</TableHead>
                        <TableHead className="w-2/12 text-left">Contato</TableHead>
                        <TableHead className="w-6/12 text-left">Endereço</TableHead>
                        <TableHead className="w-1/12 text-center">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSupliers.map((suplier) => (
                        <TableRow key={suplier.cpfCnpj}>
                            <TableCell className="font-medium">{suplier.nome}</TableCell>
                            <TableCell>{suplier.cpfCnpj}</TableCell>
                            <TableCell>{suplier.contato}</TableCell>
                            <TableCell className="text-left">{suplier.endereco}</TableCell>
                            <TableCell className="flex justify-center gap-3">
                                <Button variant="default" className="w-2/6" onClick={handleCadaster}>Editar</Button>
                                <Button variant="destructive" className="w-2/6" onClick={() => handleRemove(suplier.cpfCnpj)}>Excluir</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell className="text-right">{filteredSupliers.length} fornecedores</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    );
}
