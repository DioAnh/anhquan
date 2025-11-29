import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check login status
        if (localStorage.getItem('isLoggedIn') === 'true') {
            setIsLoggedIn(true);
        }

        // Splash screen timer - 5 seconds
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 5000); 

        return () => clearTimeout(timer);
    }, []);

    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    // Show Splash Screen first
    if (showSplash) {
        return <SplashScreen />;
    }

    // Then Login Check
    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    // Finally Main App (Dashboard)
    const userName = localStorage.getItem('userName') || 'bạn';
    return <Dashboard userName={userName} />;
}

