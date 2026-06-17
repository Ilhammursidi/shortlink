import { useState } from "react";
import useNavigate from 'react-router'
import api from "../api/axios";

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUser = () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    };

    const getToken = () => localStorage.getItem("token");
    const isAuthenticated = () => !!getToken();
    
    const register = async (data) => {
        setLoading(true);
        setError(null);
        try{
            await api.post("/api/auth/register", data)
            navigate("/login");
        }catch(err){
            setError(err.response?.data?.error || "Register failed");
        }finally{
            setLoading(false);
        }
    }
};

const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
        const res = await api.post("/api/auth/login", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify({
            name: res.data.name,
            email: res.data.email,
        }));
        navigate("/dashboard");
    } catch (error) {
        setError(err.response?.data?.error || "Login failed");
    } finally{
        setLoading(false);
    }
}

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
}

return { loading, error, getUser, getToken, isAuthenticated, register, login, logout}