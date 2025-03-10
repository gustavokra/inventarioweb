import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import '@/styles/utility.css';
import './Login.css';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
    const { toast } = useToast();
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
            const response = await fetch('http://localhost:8080/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'dbImpl': 'SQLITE',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Erro ao logar. Tente novamente",
                    description: errorData.details || JSON.stringify(errorData),
                });
                return;
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('admin', data.admin);
            localStorage.setItem('userId', data.userId);
            toast({
                title: "Sucesso",
                description: "Logado com uscesso",
            });
            navigate('/clientes');
            window.location.reload();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro inesperado"
            });
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