import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, onLogout, darkMode, toggleTheme }) => {
    return (
        <nav className="navbar"> {/* Main container for the navigation bar */}
            <div className="logo"> {/* Logo section of the navbar */}
                <Link to="/">Pokemon Team Builder</Link> {/* Link to the home page */}
            </div>
            <div className="nav-links"> {/* Navigation links */}
                <Link to="/">Home</Link> {/* Link to the home page */}
                {isLoggedIn ? (  // Conditional rendering based on login status
                    <>
                        <Link to="/create-team">Create Team</Link> {/* Link to create a new team */}
                        <Link to="/teams">View Saved Teams</Link> {/* Link to view saved teams */}
                        <Link to="/compare">Compare Teams</Link> {/* Link to compare teams */}
                        <button className="logout-button" onClick={onLogout}>  {/* Logout button */}
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/register">Register</Link> {/* Link to the registration page */}
                        <Link to="/login">Login</Link> {/* Link to the login page */}
                    </>
                )}
            </div>
            <button className="theme-toggle-button" onClick={toggleTheme}> {/* Button to toggle theme */}
                {darkMode ? "Light Mode" : "Dark Mode"} {/* Display text based on the current theme */}
            </button>
        </nav>
    );
};

export default Navbar;
