import { IProduct } from "@/@types/IProduct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../../context/ProductContext";

export default function ProductList() {
    const navigate = useNavigate();
    const { setProduct } = useProduct();
    const [products, setProducts] = useState<IProduct[]>([]);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [supplierNameFilter, setsupplierNameFilter] = useState<string>("");
    const [sortPriceOrder, setSortPriceOrder] = useState<"asc" | "desc">("asc");
    const [reload, setReload] = useState(false);


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
                    throw new Error("Erro ao buscar os dados");
                }

                setProducts(await response.json());
            } catch (err: unknown) {
                console.log(err);
            }
        };

        fetchData();
    }, [reload]);

    const handleCadaster = () => {
        navigate("/products/cadaster");
    };

    const handleEdit = (product: IProduct) => {
        setProduct(product);
        navigate("/products/cadaster");
    }

    const handleChangeStatus = async (product: IProduct) => {

        const productDataToUpdate = {
            active: !product.active
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
                throw new Error("Erro ao atualizar status");
            }

            setReload((prev) => !prev);
        } catch (err: unknown) {
            console.log(err);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
            product.supplier ?
            product.supplier.name.includes(supplierNameFilter)
            : false
    );

    const sortProducts = (order: "asc" | "desc") => {
        const sortedProducts = [...filteredProducts].sort((a, b) => {
            if (order === "asc") {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
        return sortedProducts;
    };
    const sortedProducts = sortProducts(sortPriceOrder);

    return (
        <section id="product_list" className="container flex flex-col gap-4 w-10/12 mt-4 ">
            <div className="flex justify-between mb-4">
                <h3>Produtos</h3>
                <Button onClick={handleCadaster}>Cadastrar</Button>
            </div>

            <div className="flex md:flex-row gap-4 w-full md:w-1/2">
                <Input
                    type="text"
                    placeholder="Filtrar por nome"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Filtrar por fornecedor"
                    value={supplierNameFilter}
                    onChange={(e) => setsupplierNameFilter(e.target.value)}
                />
                <Button onClick={() => setSortPriceOrder(sortPriceOrder === "asc" ? "desc" : "asc")}>
                    Preço {sortPriceOrder === "asc" ? "↑" : "↓"}
                </Button>
            </div>

            <Table>
                <TableCaption>Uma lista de seus produtos.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/12 text-left">Imagem</TableHead>
                        <TableHead className="w-2/12 text-left">Nome</TableHead>
                        <TableHead className="w-2/12 text-left">Descrição</TableHead>
                        <TableHead className="w-1/12 text-left">Preço (R$)</TableHead>
                        <TableHead className="w-1/12 text-center">Quantidade</TableHead>
                        <TableHead className="w-2/12 text-center">Fornecedor</TableHead>
                        <TableHead className="w-2/12 text-center">Ativo</TableHead>
                        <TableHead className="w-2/12 text-center">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="font-medium"><img src={product.image} /></TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell className="text-left">{product.price.toString().replace(".", ",")}</TableCell>
                            <TableCell className="text-center">{product.quantity}</TableCell>
                            <TableCell className="text-center">{product.supplier ? product.supplier.name : ''}</TableCell>
                            <TableCell className="text-center">{product.active ? 'Sim' : 'Não'}</TableCell>
                            <TableCell className="flex justify-center gap-3 justify-center">
                                <Button variant="destructive" className="w-8/6" onClick={() => handleChangeStatus(product)}> {product.active ? 'Desativar' : 'Ativar'}</Button>
                                <Button variant="default" className="w-4/12" onClick={() => handleEdit(product)}>Editar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}>Total</TableCell>
                        <TableCell className="text-right">{filteredProducts.length} produtos</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    )
}