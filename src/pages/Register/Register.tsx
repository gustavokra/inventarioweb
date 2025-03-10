import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import '@/styles/utility.css';
import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userData = {
            name,
            email,
            password,
            confirmPassword,
            roles: ['USER', 'ADMIN']
        };

        try {
            const response = await fetch('http://localhost:8080/api/v1/user', {
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

            toast({
                title: "Sucesso",
                description: "Cadastro realizado com uscesso",
            });
            navigate('/login');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro inesperado"
            });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <section id='register' className='mt-10'>
                    <header>
                        <h2>Cadastro</h2>
                    </header>
                    <div className='information'>
                        <span>
                            <Label>Nome:</Label>
                            <Input
                                name='input_name'
                                id='input_name'
                                placeholder='Digite seu nome'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </span>
                        <span>
                            <Label>E-mail:</Label>
                            <Input
                                name='input_email'
                                id='input_email'
                                placeholder='Digite seu e-mail'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </span>
                        <span>
                            <Label>Senha:</Label>
                            <Input
                                type='password'
                                name='input_password'
                                id='input_password'
                                placeholder='Digite sua senha'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </span>
                        <span>
                            <Label>Confirmar Senha:</Label>
                            <Input
                                type='password'
                                name='input_confirm_password'
                                id='input_confirm_password'
                                placeholder='Confirme sua senha'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </span>
                        <div className='actions'>
                            <Button type='submit' className='bg-zinc-900 hover:bg-zinc-800 text-white w-full'>
                                Cadastrar
                            </Button>
                        </div>
                    </div>
                </section>
            </form>

        </>
    );
};