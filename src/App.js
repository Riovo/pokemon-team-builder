import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateTeamPage from "./pages/CreateTeamPage";
import PokemonDetails from "./pages/PokemonDetails";
import TeamsPage from "./pages/TeamsPage";
import BattlePage from "./pages/BattlePage";
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';  // Import the ProtectedRoute component

// Check if the token exists in localStorage and set it in Axios default headers
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
    delete axios.defaults.headers.common['Authorization']; // Remove Authorization header if no token
}

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token')); // Check token in localStorage on load
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from localStorage
        delete axios.defaults.headers.common['Authorization']; // Remove token from axios headers
        setIsLoggedIn(false); // Set login state to false
    };

    useEffect(() => {
        document.body.className = darkMode ? "dark" : "light";
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    return (
        <Router>
            {/* Navbar is always rendered */}
            <Navbar
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
                darkMode={darkMode}
                toggleTheme={() => setDarkMode(!darkMode)}
            />
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    
                    {/* Protected routes */}
                    <Route 
                        path="/create-team" 
                        element={
                            <ProtectedRoute>
                                <CreateTeamPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/teams" 
                        element={
                            <ProtectedRoute>
                                <TeamsPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/battle" 
                        element={
                            <ProtectedRoute>
                                <BattlePage />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route path="/pokemon/:id" element={<PokemonDetails />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;