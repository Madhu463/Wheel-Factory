import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially set to null (loading state)

    useEffect(() => {
        const status = localStorage.getItem('status');
        setIsAuthenticated(status === 'Success'); // Compare status with 'Success'
    }, []);

    if (isAuthenticated === null) {
        // Show a loading spinner or message while authentication is being checked
        return <div>Auth service is working </div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

