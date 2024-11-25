import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { EnumPaginas } from '@/@types/EnumPaginas';
import LogoIcon from '@/assets/logo_icon.png';
import Amburger from '@/assets/amburguer_icon.svg';
import Close from '@/assets/close_icon.svg';

export default function Header() {
    const navigate = useNavigate();
    const [showMobileMenu, setShowMobileMenu] = useState(false);


    const logout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className='py-sm bg-gray-600 text-white px-10'>
            <nav className='flex items-center justify-between'>
                <img src={LogoIcon} alt='Logo inventário web' width={220} height={80} />

                <div className='hidden md:flex'>
                    <ul className='flex gap-x-10'>
                        {localStorage.getItem('token') ? (
                            <>
                                <li><Link to={EnumPaginas.clients}>Clientes</Link></li>
                                <li><Link to={EnumPaginas.suppliers}>Fornecedores</Link></li>
                                <li><Link to={EnumPaginas.products}>Produtos</Link></li>
                                <li><Link to={EnumPaginas.orders}>Pedidos</Link></li>
                                <li><Link to={EnumPaginas.transactions}>Transações</Link></li>
                                <li><Link to={EnumPaginas.transactions}>Relatórios</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to={EnumPaginas.login}>Login</Link></li>
                                <li><Link to={EnumPaginas.register}>Cadastro</Link></li>
                            </>
                        )}
                    </ul>

                </div>

                {localStorage.getItem('token') && (
                    <div className='hidden md:flex'>
                        <Button variant='destructive' onClick={logout}>Logout</Button>
                    </div>
                )}

                <div className='md:hidden'>
                    <span onClick={() => setShowMobileMenu(!showMobileMenu)} className='btn-wrapper'>
                        <img src={showMobileMenu ? Close : Amburger} alt='Ícone do menu' width={24} height={24} />
                    </span>
                    {showMobileMenu && (
                        <div className='absolute top-16 right-0 w-48 bg-gray-700 p-4 rounded-lg shadow-lg z-10'>
                            <ul className='flex flex-col gap-2'>
                                {localStorage.getItem('token') ? (
                                    <>
                                        <li><Link to={EnumPaginas.clients} onClick={() => setShowMobileMenu(false)}>Clientes</Link></li>
                                        <li><Link to={EnumPaginas.suppliers} onClick={() => setShowMobileMenu(false)}>Fornecedores</Link></li>
                                        <li><Link to={EnumPaginas.products} onClick={() => setShowMobileMenu(false)}>Produtos</Link></li>
                                        <li><Link to={EnumPaginas.orders} onClick={() => setShowMobileMenu(false)}>Pedidos</Link></li>
                                        <li><Link to={EnumPaginas.transactions} onClick={() => setShowMobileMenu(false)}>Transações</Link></li>
                                        <li><Button variant='destructive' onClick={() => { logout(); setShowMobileMenu(false); }}>Logout</Button></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to={EnumPaginas.login} onClick={() => setShowMobileMenu(false)}>Login</Link></li>
                                        <li><Link to={EnumPaginas.register} onClick={() => setShowMobileMenu(false)}>Cadastro</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
