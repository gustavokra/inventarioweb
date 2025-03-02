import { IGrupo } from "@/@types/IGrupo";
import { IMarca } from "@/@types/IMarca";
import { IProduct } from "@/@types/IProduct";
import { ISupplier } from "@/@types/ISupplier";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProduct } from "@/context/ProductContext";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCadaster() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [costPrice, setCostPrice] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);
    const [suppliers, setSuppliers] = useState<ISupplier[]>();
    const [supplier, setSupplier] = useState<ISupplier>();
    const [marcas, setMarcas] = useState<IMarca[]>();
    const [marca, setMarca] = useState<IMarca>();
    const [grupos, setGrupos] = useState<IGrupo[]>();
    const [grupo, setGrupo] = useState<IGrupo>();
    const [image, setImage] = useState('');
    const [active, setActive] = useState(true);
    const admin = localStorage.getItem('admin') === 'true';
    const { product, setProduct } = useProduct();
    const [isOpenGrupo, setIsOpenGrupo] = useState(false);
    const [isOpenMarca, setIsOpenMarca] = useState(false);
    const [novoGrupo, setNovoGrupo] = useState("");
    const [novaMarca, setNovaMarca] = useState("");

    const navigate = useNavigate();

    const fetchSuppliers = async () => {
        try {
            const response = await fetch(' http://35.198.61.242:8443/api/v1/supplier', {
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
                    title: "Erro ao buscar fornecedores",
                    description: errorData.details,
                });
            }
            setSuppliers(await response.json());

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao buscar fornecedores. Tente novamente ou contate o suporte." });
        }
    };

    const fetchMarcas = async () => {
        try {
            const response = await fetch(' http://35.198.61.242:8443/api/v1/marca', {
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
                    title: "Erro ao buscar marcas",
                    description: errorData.details,
                });
            }

            setMarcas(await response.json());
        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao buscar marcas. Tente novamente ou contate o suporte." });
        }
    };

    const fetchGrupos = async () => {
        try {
            const response = await fetch(' http://35.198.61.242:8443/api/v1/grupo', {
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
                    title: "Erro ao buscar grupos",
                    description: errorData.details,
                });
            }

            setGrupos(await response.json());
        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao buscar grupos. Tente novamente ou contate o suporte." });
        }
    };

    useEffect(() => {

        fetchSuppliers();
        fetchMarcas();
        fetchGrupos()

        if (product) {
            setName(product.name)
            setDescription(product.description)
            setCostPrice(product.costPrice)
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
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(reader.result as string); // Base64 da imagem
        };
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const productData: IProduct = {
            image,
            name,
            description,
            marca,
            grupo,
            costPrice,
            price,
            quantity,
            supplier,
            active,
        };

        product ? updateProduct(productData) : registerProduct(productData);
    };

    const handleExecuteSucessSubmit = () => {
        setProduct(null);
        navigate('/products');
    };

    const registerProduct = async (prodcutDataToRegister: IProduct) => {
        try {
            const response = await fetch(' http://35.198.61.242:8443/api/v1/product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(prodcutDataToRegister),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao cadastrar",
                    description: errorData.details,
                });

                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Cadastro realizado com sucesso." });
            handleExecuteSucessSubmit();

        } catch (error) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao cadastrar. Tente novamente ou contate o suporte." });
        }
    }

    const updateProduct = async (prodcutDataToUpdate: IProduct) => {
        try {
            const response = await fetch(' http://35.198.61.242:8443/api/v1/product', {
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
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar",
                    description: errorData.details,
                });
                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Atualização realizada com sucesso." });

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao atualizar. Tente novamente ou contate o suporte." });
        }
    };


    const deleteProduct = async () => {

        try {
            const response = await fetch(' http://35.198.61.242:8443/api/v1/product', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'id': String(product ? product.id : 0)
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar deletar",
                    description: errorData.details,
                });

                return;
            }

            toast({ variant: "default", title: "Sucesso!", description: "Remoção realizada com sucesso." });
            handleExecuteSucessSubmit();

        } catch (err: unknown) {
            toast({ variant: "destructive", title: "Erro inesperado", description: "Ocorreu um erro ao deletar. Tente novamente ou contate o suporte." }); 
        }
    };

    const handleCadastroGrupo = () => {
        criarGrupo()
        setIsOpenGrupo(false);
        setNovoGrupo("");
    };

    const criarGrupo = async () => {
        try {
            const novoGrupoCriar: IMarca = {
                nome: novoGrupo
            }

            const response = await fetch(' http://35.198.61.242:8443/api/v1/grupo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(novoGrupoCriar),
            });

            if (!response.ok) {
                throw new Error("Erro ao criar grupo");
            }

            fetchGrupos()
        } catch (err: unknown) {
        }
    }


    const handleCadastroMarca = () => {
        criarMarca()
        setIsOpenMarca(false);
        setNovaMarca("");
    };

    const criarMarca = async () => {
        try {
            const novaMarcaCriar: IMarca = {
                nome: novaMarca
            }

            const response = await fetch(' http://35.198.61.242:8443/api/v1/marca', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                body: JSON.stringify(novaMarcaCriar),
            });


            if (!response.ok) {
                throw new Error("Erro ao criar marca");
            }

            fetchMarcas()
        } catch (err: unknown) {
        }
    }

    return (
        <section id="produc_cadaster" className="h-screen container w-3/4 mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10">
            <header>
                <h3 className="text-foreground text-xl font-semibold">Cadastro de Produto</h3>
                {product &&
                    admin ?
                    <div className="flex justify-end">
                        <Button variant='destructive'
                            onClick={deleteProduct}>
                            Excluir
                        </Button>
                    </div>
                    : null
                }
            </header>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name" className="text-foreground">Imagem:</Label>
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
                        <Label htmlFor="marca">Marca:</Label>
                        <Select value={marca?.nome || ""}
                            onValueChange={(value) => {
                                if (value === "cadastrar") {
                                    setIsOpenMarca(true);
                                } else {
                                    const marcaSelecionada = marcas?.find((marc) => marc.nome === value);
                                    if (marcaSelecionada) {
                                        setMarca(marcaSelecionada);
                                    }
                                }
                            }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione uma marca" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="cadastrar" className="text-blue-600">
                                        + Cadastrar Marca
                                    </SelectItem>
                                    {marcas && marcas.map((marca) => (
                                        <SelectItem key={marca.id}
                                            onClick={() => {
                                                setMarca(marca)
                                            }}
                                            value={marca.nome}>{marca.nome}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                            <Dialog open={isOpenMarca} onOpenChange={setIsOpenMarca}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Cadastrar Nova Marca</DialogTitle>
                                    </DialogHeader>
                                    <input
                                        type="text"
                                        value={novaMarca}
                                        onChange={(e) => setNovaMarca(e.target.value)}
                                        className="w-full border p-2 rounded-md"
                                        placeholder="Nome da marca"
                                    />
                                    <DialogFooter>
                                        <Button onClick={() => setIsOpenMarca(false)} variant="outline">Cancelar</Button>
                                        <Button onClick={handleCadastroMarca}>Cadastrar</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="grupo">Grupo:</Label>
                        <Select value={grupo?.nome || ""}
                            onValueChange={(value) => {
                                if (value === "cadastrar") {
                                    setIsOpenGrupo(true);
                                } else {
                                    const grupoSelecionado = grupos?.find((grp) => grp.nome === value);
                                    if (grupoSelecionado) {
                                        setGrupo(grupoSelecionado);
                                    }
                                }
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione um grupo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="cadastrar" className="text-blue-600">
                                        + Cadastrar Grupo
                                    </SelectItem>
                                    {grupos && grupos.map((grp) => (
                                        <SelectItem key={grp.id}
                                            onClick={() => {
                                                setGrupo(grp)
                                            }}
                                            value={grp.nome}>{grp.nome}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Dialog open={isOpenGrupo} onOpenChange={setIsOpenGrupo}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Cadastrar Novo Grupo</DialogTitle>
                                </DialogHeader>
                                <input
                                    type="text"
                                    value={novoGrupo}
                                    onChange={(e) => setNovoGrupo(e.target.value)}
                                    className="w-full border p-2 rounded-md"
                                    placeholder="Nome do grupo"
                                />
                                <DialogFooter>
                                    <Button onClick={() => setIsOpenGrupo(false)} variant="outline">Cancelar</Button>
                                    <Button onClick={handleCadastroGrupo}>Cadastrar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                        <Label htmlFor="cost_price">Custo (R$):</Label>
                        <Input id="cost_price" maxLength={10} className="w-full"
                            placeholder="Digite o custo"
                            value={costPrice.toFixed(2).replace('.', ',')}
                            onChange={(e) => setCostPrice(e.target.value ? parseFloat(e.target.value) : 1.0)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label htmlFor="price">Preço (R$):</Label>
                        <Input id="price" maxLength={10} className="w-full"
                            placeholder="Digite o preço"
                            value={price.toFixed(2).replace('.', ',')}
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

                <div className='flex flex-col md:flex-row gap-4 mt-4'>
                    <Button 
                        className='md:w-1/4 order-2 md:order-1 bg-red-600 hover:bg-red-700 text-white' 
                        onClick={returnToList}
                    >
                        Voltar para lista
                    </Button>
                    <Button 
                        className='md:w-3/4 order-1 md:order-2 bg-zinc-900 hover:bg-zinc-800 text-white' 
                        variant='default'
                    >
                        {product ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                </div>
            </form>
        </section>
    )
}