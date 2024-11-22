import React from "react";

const LoginPage = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Login</h1>
            <form>
                <input type="text" placeholder="Username" style={{ display: "block", margin: "10px auto", padding: "10px", width: "300px" }} />
                <input type="password" placeholder="Password" style={{ display: "block", margin: "10px auto", padding: "10px", width: "300px" }} />
                <button style={{ display: "block", margin: "10px auto", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
