import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout, darkMode, toggleTheme }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">Pokemon Team Builder</Link>
            </div>
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                <Link to="/">Home</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/create-team">Create Team</Link>
                        <Link to="/teams">View Saved Teams</Link>
                        <Link to="/compare">Compare Teams</Link>
                        <button className="logout-button" onClick={onLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
                <button className="theme-toggle-button" onClick={toggleTheme}>
                    {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>
            <button className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>
        </nav>
    );
};

export default Navbar;