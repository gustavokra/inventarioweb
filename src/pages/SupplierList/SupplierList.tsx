import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ISupplier } from "@/@types/ISupplier";
import { useSupplier } from "@/context/SupplierContext";

export function SupplierList() {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [documentFilter, setDocumentFilter] = useState<string>("");
    const [reload, setReload] = useState(false);
    const [nameSortOrder, setNameSortOrder] = useState<"asc" | "desc">("asc");

    const { setSupplier } = useSupplier();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/v1/supplier', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'dbImpl': 'SQLITE',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar os dados");
                }
                setSuppliers(await response.json());
            } catch (err: unknown) {
                console.log(err);
            }
        };

        fetchData();
    }, [reload]);

    const handleCadaster = () => {
        navigate("/suppliers/cadaster");
    };

    const handleEdit = (supplier: ISupplier) => {
        setSupplier(supplier);
        navigate("/suppliers/cadaster");
    }

    const handleChangeStatus = async (supplier: ISupplier) => {
        const newSupplierActiveStatus = supplier.active ? false : true

        const supplierDataToUpdate = {
            active: newSupplierActiveStatus
        }

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/supplier', {
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
                throw new Error("Erro ao buscar os dados");
            }

            setReload((prev) => !prev);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        supplier.document.includes(documentFilter)
    );


    const sortSuppliersByName = (order: "asc" | "desc") => {
        const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
            if (order === "asc") {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        return sortedSuppliers;
    };
    const sortedSuppliers = sortSuppliersByName(nameSortOrder);


    return (
        <section id="supplier_list" className="container flex flex-col gap-4 w-10/12 mt-4 ">
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
                    value={documentFilter}
                    onChange={(e) => setDocumentFilter(e.target.value)}
                />
                <Button onClick={() => setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc")}>
                    Nome {nameSortOrder === "asc" ? "↑" : "↓"}
                </Button>
            </div>

            <Table>
                <TableCaption>Uma lista de seus fornecedores.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2/12 text-left">Nome</TableHead>
                        <TableHead className="w-2/12 text-left">CPF/CNPJ</TableHead>
                        <TableHead className="w-2/12 text-left">Contato</TableHead>
                        <TableHead className="w-3/12 text-left">Endereço</TableHead>
                        <TableHead className="w-2/12 text-center">Ativo</TableHead>
                        <TableHead className="w-1/12 text-center">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedSuppliers.map((supplier) => (
                        <TableRow key={supplier.document}>
                            <TableCell className="font-medium">{supplier.name}</TableCell>
                            <TableCell>{supplier.document}</TableCell>
                            <TableCell>{supplier.contact}</TableCell>
                            <TableCell className="text-left">{supplier.address}</TableCell>
                            <TableCell className="text-center">{supplier.active ? "Sim" : "Não"}</TableCell>
                            <TableCell className="flex justify-center gap-3">
                                <Button variant="destructive" className="w-8/6" onClick={() => handleChangeStatus(supplier)}> {supplier.active ? 'Desativar' : 'Ativar'}</Button>
                                <Button variant="default" className="w-4/12" onClick={() => handleEdit(supplier)}>Editar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className="text-right">{filteredSuppliers.length} fornecedores</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    );
}
