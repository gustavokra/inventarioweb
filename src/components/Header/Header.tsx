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
        <header className='bg-[var(--color-primary)] shadow-md'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <nav className='flex items-center justify-between h-16'>
                    {/* Logo */}
                    <div className='flex-shrink-0 flex items-center'>
                        <img 
                            src={LogoIcon} 
                            alt='Logo inventário Fert do Reino' 
                            className='h-10 w-auto'
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className='hidden md:flex items-center space-x-8'>
                        <Link 
                            to={EnumPaginas.pdv} 
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            PDV
                        </Link>
                        <Link 
                            to={EnumPaginas.listaCaixa} 
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            Caixa
                        </Link>
                        <Link 
                            to={EnumPaginas.clients} 
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            Clientes
                        </Link>
                        <Link 
                            to={EnumPaginas.suppliers}
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            Fornecedores
                        </Link>
                        <Link 
                            to={EnumPaginas.products}
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            Produtos
                        </Link>
                        <Link 
                            to={EnumPaginas.formaPagamento}
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            Formas de Pagamento
                        </Link>
                        <Link 
                            to={EnumPaginas.orders}
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            Pedidos
                        </Link>
                        <Link 
                            to={EnumPaginas.transactions}
                            className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                        >
                            Transações
                        </Link>
                    </div>

                    {/* Logout Button */}
                    <div className='hidden md:flex items-center'>
                        <Button 
                            onClick={logout}
                            className='bg-white text-[var(--color-primary)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary-dark)] transition-colors'
                        >
                            Logout
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='md:hidden'>
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className='inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[var(--color-gray-100)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        >
                            <img 
                                src={showMobileMenu ? Close : Amburger} 
                                alt='Menu'
                                className='h-6 w-6'
                            />
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className='md:hidden py-4'>
                        <div className='flex flex-col space-y-4'>
                            <Link 
                                to={EnumPaginas.pdv}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                PDV
                            </Link>
                            <Link 
                                to={EnumPaginas.listaCaixa}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Lista de Caixas
                            </Link>
                            <Link 
                                to={EnumPaginas.caixa}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Caixa
                            </Link>
                            <Link 
                                to={EnumPaginas.clients}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Clientes
                            </Link>
                            <Link 
                                to={EnumPaginas.suppliers}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Fornecedores
                            </Link>
                            <Link 
                                to={EnumPaginas.products}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Produtos
                            </Link>
                            <Link 
                                to={EnumPaginas.formaPagamento}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Formas de Pagamento
                            </Link>
                            <Link 
                                to={EnumPaginas.orders}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Pedidos
                            </Link>
                            <Link 
                                to={EnumPaginas.transactions}
                                className='text-white hover:text-[var(--color-gray-100)] transition-colors'
                                onClick={() => setShowMobileMenu(false)}
                            >
                                Transações
                            </Link>
                            <Button 
                                onClick={() => {
                                    logout();
                                    setShowMobileMenu(false);
                                }}
                                className='bg-white text-[var(--color-primary)] hover:bg-[var(--color-gray-100)] hover:text-[var(--color-primary-dark)] transition-colors w-full'
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
