import Header from '@/components/Header/Header'
import { CaixaProvider } from '@/context/CaixaContext'
import { ClientProvider } from '@/context/ClientContext'
import { FormaPagamentoProvider } from '@/context/FormaPagamentoContext'
import { OrderProvider } from '@/context/OrderContext'
import { ProductProvider } from '@/context/ProductContext'
import { SupplierProvider } from '@/context/SupplierContext'
import CadastroFormaPagamento from '@/pages/CadastroFormaPagamento/CadastroFormaPagamento'
import Caixa from '@/pages/Caixa/Caixa'
import ClientCadaster from '@/pages/ClientCadaster/ClientCadaster'
import ClientList from '@/pages/ClientList/ClientList'
import ListaCaixa from '@/pages/ListaCaixa/ListaCaixa'
import ListaFormaPagamento from '@/pages/ListaFormasPagamento/ListaFormaPagamento'
import Login from '@/pages/Login/Login'
import OrderCadaster from '@/pages/OrderCadaster/OrderCadaster'
import OrderList from '@/pages/OrderList/OrderList'
import PDV from '@/pages/PDV/PDV'
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
                <Route path='/cadastro' element={<Register />} />

                <Route path='/pdv' element={isAuthenticated ? <CaixaProvider><PDV /></CaixaProvider> : <Login />} />
                <Route path='/caixa' element={isAuthenticated ? <CaixaProvider><Caixa /></CaixaProvider> : <Login />} />
                <Route path='/lista-caixa' element={isAuthenticated ? <CaixaProvider><ListaCaixa /></CaixaProvider> : <Login />} />

                <Route path='/clientes' element={isAuthenticated ? <ClientProvider> <ClientList />  </ClientProvider> : <Login />} />
                <Route path='/clientes/cadastro' element={isAuthenticated ? <ClientProvider> <ClientCadaster /> </ClientProvider> : <Login />} />

                <Route path='/fornecedores' element={isAuthenticated ? <SupplierProvider><SupplierList /></SupplierProvider> : <Login />} />
                <Route path='/fornecedores/cadastro' element={isAuthenticated ?<SupplierProvider> <SupplierCadaster /> </SupplierProvider> : <Login />} />

                <Route path='/produtos' element={isAuthenticated ? <ProductProvider> <ProductList /> </ProductProvider>: <Login />} />
                <Route path='/produtos/cadastro' element={isAuthenticated ? <ProductProvider> <ProductCadaster /> </ProductProvider> : <Login />} />

                <Route path='/pedidos' element={isAuthenticated ? <OrderProvider> <OrderList /> </OrderProvider>: <Login />} />
                <Route path='/pedidos/cadastro' element={isAuthenticated ? <OrderProvider> <OrderCadaster /> </OrderProvider> : <Login />} />

                <Route path='/formas-pagamento' element={isAuthenticated ? <FormaPagamentoProvider> <ListaFormaPagamento /> </FormaPagamentoProvider> : <Login />} />
                <Route path='/formas-pagamento/cadastro' element={isAuthenticated ? <FormaPagamentoProvider> <CadastroFormaPagamento /> </FormaPagamentoProvider> : <Login />} />
            
                {/* <Route path='/transactions' element={isAuthenticated ? <TransactionList /> : <Login />} /> */}
            </Routes>
        </Router>
    );
}

export default Navigator;