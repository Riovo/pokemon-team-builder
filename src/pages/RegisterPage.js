import React from "react";

const RegisterPage = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Register</h1>
            <form>
                <input type="text" placeholder="Username" style={{ display: "block", margin: "10px auto", padding: "10px", width: "300px" }} />
                <input type="email" placeholder="Email" style={{ display: "block", margin: "10px auto", padding: "10px", width: "300px" }} />
                <input type="password" placeholder="Password" style={{ display: "block", margin: "10px auto", padding: "10px", width: "300px" }} />
                <button style={{ display: "block", margin: "10px auto", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
