import ClientCadaster from "@/pages/ClientCadaster/ClientCadaster"
import { ClientList } from "@/pages/ClientList/ClientList"
import Login from "@/pages/Login/Login"
import Register from "@/pages/Register/Register"
import SupplierCadaster from "@/pages/SupplierCadaster/SupplierCadaster"
import { SupplierList } from "@/pages/SupplierList/SupplierList"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ClientProvider } from '../../context/ClientContext'
import Header from "../header/Header"
import { SupplierProvider } from "@/context/SupplierContext"

const Navigator = () => {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <Router>
            <Header />
            <Routes>

                <Route path="/" element={
                    isAuthenticated ? <ClientList /> : <Login />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/clients" element={isAuthenticated ? <ClientProvider> <ClientList />  </ClientProvider> : <Login />} />
                <Route path="/clients/cadaster" element={isAuthenticated ? <ClientProvider> <ClientCadaster /> </ClientProvider> : <Login />} />

                <Route path="/suppliers" element={<SupplierProvider><SupplierList /></SupplierProvider>} />
                <Route path="/suppliers/cadaster" element={<SupplierProvider> <SupplierCadaster /> </SupplierProvider>} />
                {/* <Route path="/products" element={isAuthenticated ? <ProductCadaster /> : <Navigate to="/login" />} /> */}
            </Routes>
        </Router>
    );
}

export default Navigator;