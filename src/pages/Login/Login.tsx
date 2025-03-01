import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import '@/styles/utility.css';
import './Login.css';
import { Label } from '@/components/ui/label';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userData = {
            email,
            password,
        };
        try {
            const response = await fetch('http://35.198.61.242:8080/api/v1/auth/login', {
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
            localStorage.setItem('admin', data.admin);
            localStorage.setItem('userId', data.userId);
            navigate('/clients');
        } catch (error) {
            console.error('Erro ao logar usuário:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <section id='login' className='mt-10'>
                <header>
                    <h2>Login</h2>
                </header>
                <div className='information'>
                    <span>
                        <Label>Nome:</Label>
                        <Input
                            id='input_name'
                            placeholder='Digite seu nome'
                            onChange={(e) => setEmail(e.target.value)}
                        ></Input>
                    </span>
                    <span>
                        <Label>Senha:</Label>
                        <Input
                            id='input_password'
                            type='password'
                            placeholder='Digite sua senha'
                            onChange={(e) => setPassword(e.target.value)}></Input>
                    </span>
                    <div className='actions'>
                        <Button type='submit' className='bg-zinc-900 hover:bg-zinc-800 text-white w-full' size={'submit'}>
                            Logar
                        </Button>
                    </div>
                </div>
            </section>
        </form>
    )
}