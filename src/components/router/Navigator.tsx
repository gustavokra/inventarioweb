import Login from "@/pages/Login/Login"
import Register from "@/pages/Register/Register"
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from "../header/Header"
import Clients from "@/pages/ClientList/ClientList"
import ProductCadaster from "@/pages/Products/ProductCadaster"

const Navigator = () => {
    const isAuthenticated = localStorage.getItem('token');

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={
                    isAuthenticated ? <Clients /> : <Clients />
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/clients" element={
                    isAuthenticated ? <Clients /> : <Clients/>
                } />
                <Route path="/products" element={
                    isAuthenticated ? <ProductCadaster /> : <Navigate to="/login" />
                } />
            </Routes>
        </Router>
    );
}

export default Navigator;