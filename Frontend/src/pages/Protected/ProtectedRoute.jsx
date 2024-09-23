import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // use null initially

    useEffect(() => {
        // Set the authenticated status only when component mounts
        const status = localStorage.getItem('status');
        setIsAuthenticated(status);
    }, []); // Add an empty dependency array to run useEffect only once

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Optional: You can show a loading state until authentication status is determined
    }

    return (isAuthenticated === 'Success') ? <Outlet /> : <Navigate to="/login" />;
}
