import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import brainLogo from '../Assets/logo.png';
import useGeneral from '../hooks/useGeneral';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [activeButton, setActiveButton] = useState<string>('');
    const { isLoggedIn, setIsLoggedIn, user, setUser, loading } = useGeneral();
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const userEmail = user?.email || '';
    const userName = user?.name || '';

    useEffect(() => {
        const pathMap: Record<string, string> = {
            '/landing': 'landing',
            '/login-signup': 'login-signup',
            '/home': 'home',
            '/user': 'user',
            '/contact': 'contact',
            '/information': 'information',
            '/doctors': 'doctors',
            '/report-form': 'report-form',
            '/download-report': 'download-report',
            '/upload-ctscan': 'upload-ctscan',
        };
        setActiveButton(pathMap[location.pathname] || '');
    }, [location.pathname]);

    useEffect(() => {
        setShowDropdown(false);
        setMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNavigate = (path: string, buttonName: string) => {
        navigate(path);
        setActiveButton(buttonName);
        setShowDropdown(false);
    };

    const handleMobileNavigate = (path: string, buttonName: string) => {
        handleNavigate(path, buttonName);
        setMobileMenuOpen(false);
    };

    const handleUploadClick = () => {
        if (isLoggedIn) {
            handleNavigate('/home', 'home');
        } else {
            navigate('/login-signup');
        }
    };

    const handleCTScanUploadClick = () => {
        if (isLoggedIn) {
            handleNavigate('/upload-ctscan', 'upload-ctscan');
        } else {
            navigate('/login-signup');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:5000/users/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.error('Logout failed:', err);
        }
        setIsLoggedIn(false);
        setUser(null);
        setShowDropdown(false);
        setMobileMenuOpen(false);
        navigate('/landing');
    };

    const getInitials = (name: string) => {
        const [first, last] = name.trim().split(' ');
        return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={brainLogo} alt="Brain Logo" className="navbar-logo" />
                <span className="navbar-brand">Brain Tumor Detection Using Artificial Intelligence</span>
            </div>

            <div className="nav-buttons">
                <button onClick={() => handleNavigate('/landing', 'landing')} className={activeButton === 'landing' ? 'active' : ''}>Home</button>

                {!loading && !isLoggedIn && (
                    <button onClick={() => handleNavigate('/login-signup', 'login-signup')} className={activeButton === 'login-signup' ? 'active' : ''}>
                        Signup & Login
                    </button>
                )}
                <button onClick={handleUploadClick} className={activeButton === 'home' ? 'active' : ''}>Upload MRI</button>
                <button onClick={handleCTScanUploadClick} className={activeButton === 'upload-ctscan' ? 'active' : ''}>Upload CT-Scan</button>
                <button onClick={() => handleNavigate('/doctors', 'doctors')} className={activeButton === 'doctors' ? 'active' : ''}>Doctors</button>

                {!loading && isLoggedIn && (
                    <button onClick={() => handleNavigate('/user', 'user')} className={activeButton === 'user' ? 'active' : ''}>Account Info</button>
                )}
                <button onClick={() => handleNavigate('/contact', 'contact')} className={activeButton === 'contact' ? 'active' : ''}>Contact Us</button>
                <button onClick={() => handleNavigate('/information', 'information')} className={activeButton === 'information' ? 'active' : ''}>About Us</button>

                <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>

                {!loading && isLoggedIn && (
                    <div className="profile-wrapper" ref={dropdownRef}>
                        <div className="profile-circle" onClick={() => setShowDropdown(!showDropdown)}>
                            {getInitials(userName)}
                        </div>
                        {showDropdown && (
                            <div className="dropdown-menu">
                                <div className="user-info">
                                    <strong>{userName}</strong>
                                    <div className="user-email">{userEmail}</div>
                                </div>
                                <div className="dropdown-divider" />
                                <button onClick={() => handleNavigate('/user', 'user')}>Account Info</button>
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {mobileMenuOpen && (
                <div className="mobile-dropdown">
                    <button onClick={() => handleMobileNavigate('/landing', 'landing')} className={activeButton === 'landing' ? 'active' : ''}>Home</button>
                    {!loading && !isLoggedIn && (
                        <button onClick={() => handleMobileNavigate('/login-signup', 'login-signup')} className={activeButton === 'login-signup' ? 'active' : ''}>Signup & Login</button>
                    )}
                    <button onClick={handleUploadClick} className={activeButton === 'home' ? 'active' : ''}>Upload MRI</button>
                    <button onClick={handleCTScanUploadClick} className={activeButton === 'upload-ctscan' ? 'active' : ''}>Upload CT-Scan</button>
                    <button onClick={() => handleMobileNavigate('/doctors', 'doctors')} className={activeButton === 'doctors' ? 'active' : ''}>Doctors</button>
                    {!loading && isLoggedIn && (
                        <button onClick={() => handleMobileNavigate('/user', 'user')} className={activeButton === 'user' ? 'active' : ''}>Account Info</button>
                    )}
                    <button onClick={() => handleMobileNavigate('/contact', 'contact')} className={activeButton === 'contact' ? 'active' : ''}>Contact Us</button>
                    <button onClick={() => handleMobileNavigate('/information', 'information')} className={activeButton === 'information' ? 'active' : ''}>About Us</button>
                    {!loading && isLoggedIn && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
