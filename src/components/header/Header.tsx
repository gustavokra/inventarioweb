import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { EnumPaginas } from '@/@types/EnumPaginas'
import LogoIcon from '@/assets/logo_icon.png'
import Amburger from '@/assets/amburguer_icon.svg'
import Close from '@/assets/close_icon.svg'
import './Header.css'
import '../../styles/utility.css'

export default function Header() {
    const navigate = useNavigate();

    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const atribute = showMobileMenu ? "hidden" : "visible"

        document.documentElement.style.overflowY = atribute
    }, [showMobileMenu])

    const logout = () => {
        localStorage.removeItem('token');
        navigate("/login")
    }

    return (
        <>
            <header className='container py-sm brackgound'>
                <nav className='flex items-center justify-between'>
                    <img src={LogoIcon} alt="Logo inventário web" width={220} height={80} />
                    <div className="desktop-only flex">
                        <ul className='flex gap-x-10'>
                            {localStorage.getItem('token') ?
                                <>
                                    <li><Link to={EnumPaginas.clients}>Clientes</Link></li>
                                    <li><Link to={EnumPaginas.products}>Fornecedores</Link></li>
                                    <li><Link to={EnumPaginas.products}>Produtos</Link></li>
                                    <li><Link to={EnumPaginas.products}>Pedidos</Link></li>
                                    <li><Link to={EnumPaginas.products}>Transações</Link></li>
                                </>
                                :
                                <>
                                    <li><Link to={EnumPaginas.login}>Login</Link></li>
                                    <li><Link to={EnumPaginas.register}>Cadastro</Link></li>
                                </>
                            }
                        </ul>
                    </div>
                    {localStorage.getItem('token') ?
                        <Button variant={'destructive'} onClick={() => logout()}>Logout</Button>
                        : <></>
                    }
                    <div className="mobile-menu">
                        {showMobileMenu ?
                            <div className="mobile-menu-content">
                                <div className="container flex">
                                    {localStorage.getItem('token') ?
                                        <ul className="flex gap-1 items-center">
                                            <li><Link to={EnumPaginas.clients} onClick={() => setShowMobileMenu(!showMobileMenu)}>Clientes</Link></li>
                                            <li><Link to={EnumPaginas.products} onClick={() => setShowMobileMenu(!showMobileMenu)}>Fornecedores</Link></li>
                                            <li><Link to={EnumPaginas.products} onClick={() => setShowMobileMenu(!showMobileMenu)}>Produtos</Link></li>
                                            <li><Link to={EnumPaginas.products} onClick={() => setShowMobileMenu(!showMobileMenu)}>Pedidos</Link></li>
                                            <li><Link to={EnumPaginas.products} onClick={() => setShowMobileMenu(!showMobileMenu)}>Transações</Link></li>
                                            <li><Button variant={'destructive'} onClick={() => logout()}>Logout</Button></li>
                                        </ul>
                                        :
                                        <>
                                            <li><Link to={EnumPaginas.login}>Login</Link></li>
                                            <li><Link to={EnumPaginas.register}>Cadastro</Link></li>
                                        </>
                                    }
                                    <span onClick={() => setShowMobileMenu(!showMobileMenu)} className="btn-wrapper">
                                        <img src={Close} alt="ícone fechar menu" width={24} height={24} />
                                    </span>
                                </div>
                            </div>
                            : <span onClick={() => setShowMobileMenu(!showMobileMenu)} className="btn-wrapper">
                                <img src={Amburger} alt="ícone menu" width={24} height={24} />
                            </span>
                        }
                    </div>
                </nav>
            </header>
        </>
    )
}