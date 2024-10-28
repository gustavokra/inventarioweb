import React, { useState } from 'react';
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import './Register.css'
import '@/styles/utility.css'

export default function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 

        const userData = {
            name,
            email,
            password,
            confirmPassword,
        };

        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/user/cadaster', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.status}`);
            }

            const data = await response.json();
            console.log('Usuário cadastrado com sucesso:', data);
            navigate('/login');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <section id="register">
                <header>
                    <h1>Cadastre-se</h1>
                </header>
                <div className='information'>
                    <span>
                        <label>Nome:</label>
                        <input 
                            name='input_name' 
                            id="input_name" 
                            placeholder="Digite seu nome" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </span>
                    <span>
                        <label>E-mail:</label>
                        <input 
                            name='input_email' 
                            id="input_email" 
                            placeholder="Digite seu e-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
                        />
                    </span>
                    <span>
                        <label>Senha:</label>
                        <input 
                            type="password" // Adicione type="password" para ocultar a senha
                            name='input_password' 
                            id="input_password" 
                            placeholder="Digite sua senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Atualiza o estado ao digitar
                        />
                    </span>
                    <span>
                        <label>Confirmar Senha:</label>
                        <input 
                            type="password" // Adicione type="password" para ocultar a senha
                            name='input_confirm_password' 
                            id="input_confirm_password" 
                            placeholder="Confirme sua senha" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} // Atualiza o estado ao digitar
                        />
                    </span>
                    <div className="actions">
                        <Button type='submit' variant="default" size={'submit'}>Cadastrar</Button>
                    </div>
                </div>
            </section>
        </form>
    );
};