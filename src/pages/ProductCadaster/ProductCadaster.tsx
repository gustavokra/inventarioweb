import { IProduct } from "@/@types/IProduct";
import { ISupplier } from "@/@types/ISupplier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProduct } from "@/context/ProductContext";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCadaster() {
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [suppliers, setSuppliers] = useState<ISupplier[]>();
    const [supplier, setSupplier] = useState<ISupplier>();
    const [image, setImage] = useState('');
    const [active, setActive] = useState(true);
    const { product, setProduct } = useProduct();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
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

        fetchSuppliers();

        if (product) {
            setId(product.id ? product.id : 0)
            setName(product.name)
            setDescription(product.description)
            setPrice(product.price)
            setQuantity(product.quantity)
            setSupplier(product.supplier)
            setImage(product.image)
            setActive(product.active)
        }


    }, [product]);

    const returnToList = () => {
        setProduct(null)
        navigate("/products")
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const productData: IProduct = {
            image,
            name,
            description,
            price,
            quantity,
            supplier,
            active,
        };

        product ? updateProduct(productData) : registerProduct(productData);
    };

    const registerProduct = async (prodcutDataToRegister: IProduct) => {
        try {
            console.log({ prodcutDataToRegister })
            const response = await fetch('http://127.0.0.1:8080/api/v1/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(prodcutDataToRegister),
            });

            if (!response.ok) {
                console.log(response.status)
                throw new Error(`Erro: ${response.status}`);
            }

            navigate('/products');

        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
        }
    }

    const updateProduct = async (prodcutDataToUpdate: IProduct) => {

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(product ? product.id : 0)
                },
                body: JSON.stringify(prodcutDataToUpdate)
            });

            if (!response.ok) {
                throw new Error("Erro atualizar produto");
            }

        } catch (err: unknown) {
            console.log(err);
        }

        navigate('/products');
    };


    const deleteProduct = async () => {

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/product', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(product ? product.id : 0)
                },
            });

            if (!response.ok) {
                throw new Error("Erro excluir produto");
            }

        } catch (err: unknown) {
            console.log(err);
        }

        setProduct(null)
        navigate('/products');
    };


    return (
        <section id="produc_cadaster" className="h-screen container w-3/4 mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10">
            <header>
                <h3>Cadastro de Produto</h3>
                {product &&
                    <div className="flex justify-end">
                        <Button variant='destructive'
                            onClick={deleteProduct}>
                            Excluir
                        </Button>
                    </div>
                }
            </header>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Imagem:</Label>
                        <Input id="image" type="file" className="w-full"
                            value={""}
                            onChange={handleImageChange} />
                        {image && <img src={image} alt="Imagem do produto" width={200} height={200} />}
                    </div>
                    <div>
                        <Label htmlFor="supplier">Fornecedor:</Label>
                        <Select value={supplier?.name || ""}
                            onValueChange={(value) => {
                                const selectedSupplier = suppliers?.find((suppl) => suppl.name === value);
                                if (selectedSupplier) {
                                    setSupplier(selectedSupplier);
                                }
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um fornecedor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {suppliers && suppliers.map((suppl) => (
                                        <SelectItem key={suppl.id}
                                            onClick={() => {
                                                setSupplier(suppl)
                                            }}
                                            value={suppl.name}>{suppl.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="name">Nome:</Label>
                        <Input id="name" type="text" className="w-full" placeholder="Digite o nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="description">Descrição:</Label>
                        <Input id="description" type="text" className="w-full" placeholder="Digite a descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="price">Preço (R$):</Label>
                        <Input id="price" maxLength={10} className="w-full" 
                            placeholder="Digite o preço"
                            value={price.toFixed(2).replace('.',',')}
                            onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : 1.0)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="quantity">Quantidade:</Label>
                        <Input id="quantity" type="number" maxLength={10} className="w-full" 
                            placeholder="Digite a quantidade"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value) : 1)}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-4">
                    <Button className="md:w-1/4 order-2 md:order-1" variant="destructive"
                        onClick={() => returnToList()}>
                        Voltar para lista</Button>
                    <Button className="md:w-3/4 order-1 md:order-2" variant="default">{product ? 'Atualizar' : 'Cadastrar'}</Button>
                </div>
            </form>
        </section>
    )
}