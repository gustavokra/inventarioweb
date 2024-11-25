import Header from '@/components/Header/Header'
import { ClientProvider } from '@/context/ClientContext'
import { OrderProvider } from '@/context/OrderContext'
import { ProductProvider } from '@/context/ProductContext'
import { SupplierProvider } from '@/context/SupplierContext'
import ClientCadaster from '@/pages/ClientCadaster/ClientCadaster'
import ClientList from '@/pages/ClientList/ClientList'
import Login from '@/pages/Login/Login'
import OrderList from '@/pages/OrderList/OrderList'
import ProductCadaster from '@/pages/ProductCadaster/ProductCadaster'
import ProductList from '@/pages/ProductList/ProductList'
import Register from '@/pages/Register/Register'
import SupplierCadaster from '@/pages/SupplierCadaster/SupplierCadaster'
import SupplierList from '@/pages/SupplierList/SupplierList'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

const Navigator = () => {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={
                    isAuthenticated ?<ClientProvider> <ClientList/>  </ClientProvider>: <Login />
                } />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                <Route path='/clients' element={isAuthenticated ? <ClientProvider> <ClientList />  </ClientProvider> : <Login />} />
                <Route path='/clients/cadaster' element={isAuthenticated ? <ClientProvider> <ClientCadaster /> </ClientProvider> : <Login />} />

                <Route path='/suppliers' element={isAuthenticated ? <SupplierProvider><SupplierList /></SupplierProvider> : <Login />} />
                <Route path='/suppliers/cadaster' element={isAuthenticated ?<SupplierProvider> <SupplierCadaster /> </SupplierProvider> : <Login />} />

                <Route path='/products' element={isAuthenticated ? <ProductProvider> <ProductList /> </ProductProvider>: <Login />} />
                <Route path='/products/cadaster' element={isAuthenticated ? <ProductProvider> <ProductCadaster /> </ProductProvider> : <Login />} />

                <Route path='/orders' element={isAuthenticated ? <OrderProvider> <OrderList /> </OrderProvider>: <Login />} />
                <Route path='/orders/cadaster' element={isAuthenticated ? <OrderProvider> <OrderList /> </OrderProvider> : <Login />} />
            </Routes>
        </Router>
    );
}

export default Navigator;