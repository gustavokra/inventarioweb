import Login from "@/pages/Login/Login"
import Register from "@/pages/Register/Register"
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from "../header/Header"
import ProductCadaster from "@/pages/Products/ProductCadaster"
import { ClientList } from "@/pages/ClientList/ClientList"
import ClientCadaster from "@/pages/ClientCadaster/ClientCadaster"
import { SuplierList } from "@/pages/SuplierList/SuplierList"
import SuplierCadaster from "@/pages/SuplierCadaster/SuplierCadaster"

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
                <Route path="/clients" element={isAuthenticated ? <ClientList /> : <ClientList /> } />
                <Route path="/clients/cadaster" element={isAuthenticated ? <ClientCadaster /> : <ClientCadaster />} />
                <Route path="/supliers" element={<SuplierList />} />
                <Route path="/supliers/cadaster" element={<SuplierCadaster />} />
                {/* <Route path="/products" element={isAuthenticated ? <ProductCadaster /> : <Navigate to="/login" />} /> */}
            </Routes>
        </Router>
    );
}

export default Navigator;