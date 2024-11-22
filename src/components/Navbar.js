import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, onLogout, darkMode, toggleTheme }) => {
    return (
        <nav className="navbar">
            <div className="logo">
                <Link to="/">Pokemon Team Builder</Link>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/create-team">Create Team</Link>
                        <button className="logout-button" onClick={onLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register">Register</Link>
                        <Link to="/login">Login</Link>
                    </>
                )}
            </div>
            <button className="theme-toggle-button" onClick={toggleTheme}>
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
        </nav>
    );
};

export default Navbar;
