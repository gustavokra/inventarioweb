import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import '@/styles/utility.css';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userData = {
            name,
            password,
        };
        try {
            const response = await fetch('http://127.0.0.1:8080/api/v1/user/login', {
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
            console.log('Usuário logado com sucesso:', data);
            localStorage.setItem('token', data.token);
            navigate('/clients');
        } catch (error) {
            console.error('Erro ao logar usuário:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <section id="login">
                <header>
                    <h1>Login</h1>
                </header>
                <div className='information'>
                    <span>
                        <label>Nome:</label>
                        <input
                            id="input_name"
                            placeholder="Digite seu nome"
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </span>
                    <span>
                        <label>Senha:</label>
                        <input
                            id="input_password"
                            type='password'
                            placeholder="Digite sua senha"
                            onChange={(e) => setPassword(e.target.value)}></input>
                    </span>
                    <div className="actions">
                        <Button type='submit' variant="default" size={'submit'}>Logar</Button>
                    </div>
                </div>
            </section>
        </form>
    )
}