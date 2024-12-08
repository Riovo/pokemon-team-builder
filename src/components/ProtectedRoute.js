import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [messageVisible, setMessageVisible] = useState(true); // State to control the visibility of the message
  const [token] = useState(localStorage.getItem('token')); // Get token from localStorage

  const handleRedirect = () => {
    // When the user clicks OK, hide the message and redirect to the home page
    setMessageVisible(false);
  };

  if (!token && messageVisible) {
    // If no token and the message is visible, show the message
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Login to view this page.</p>
        <button onClick={handleRedirect} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          OK
        </button>
      </div>
    );
  }

  if (!token) {
    // If the token is still not present and the message is no longer visible, redirect them home
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;