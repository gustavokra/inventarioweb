import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function SuplierCadaster() {

    const navigate = useNavigate();

    const returnToList = () => {
        navigate("/supliers")
    }

    return (
        <section id="clients" className="container w-3/4 mx-auto mt-2 sm:mt-4 md:mt-6 lg:mt-8 xl:mt-10">
            <header>
                <h3>Cadastro de fornecedores</h3>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Nome:</Label>
                    <Input id="name" type="text" className="w-full" placeholder="Digite seu nome" />
                </div>
                <div>
                    <Label htmlFor="cpf_cnpj">Cpf/Cnpj:</Label>
                    <Input id="cpf_cnpj" type="text" className="w-full" placeholder="Digite seu cpf ou cnpj"/>
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="contato">Contato:</Label>
                    <Input id="contato" type="text" className="w-full" placeholder="Digite seu contato"/>
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço:</Label>
                    <Input id="endereco" type="text" className="w-full" placeholder="Digite seu endereço"/>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Button className="md:w-1/4" variant="destructive"
                onClick={() => returnToList()}>
                    Voltar para lista</Button>
                <Button className="md:w-3/4" variant="default"
                onClick={() => returnToList()}>Cadastrar</Button>
            </div>
        </section>
    )
}