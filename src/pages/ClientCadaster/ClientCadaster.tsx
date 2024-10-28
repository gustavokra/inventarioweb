import { Button } from "@/components/ui/button";
import './ClientCadaster.css'

export default function Clients() {

    return (
        <section id='clients' className="container">
            <header>
                <h3>Cadastro de clientes</h3>
            </header>
            <div>
                <span>
                    <label htmlFor="name">Nome:</label>
                    <input id='name' type="text" />
                </span>
                <span>
                    <label htmlFor="cpf_cnpj">Cpf/Cnpj</label>
                    <input id='cpf_cnpj' type="text" />
                </span>
                <span>
                    <label htmlFor="contato">Contato</label>
                    <input id='contato' type="text" />
                </span>
                <span>
                    <label htmlFor="endereco">Endereço</label>
                    <input id='endereco' type="text" />
                </span>
            </div>
            <div className="actions">
                <Button>Cadastrar</Button>
            </div>
        </section>
    )
}