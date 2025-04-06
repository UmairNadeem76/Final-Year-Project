import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Landing.css';
import TestimonialCarousel from './TestimonialCarousel';
import Footer from './Footer';
import LandingStats from './LandingStats';
import HowItWorks from './HowItWorks';
import About from './About';
import FAQ from './FAQ';

import landingVideo from '../Assets/login_video.mp4';
import useGeneral from '../hooks/useGeneral';

const Landing: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState(false);
    const { isLoggedIn, setIsLoggedIn, user, setUser } = useGeneral();
    const navigate = useNavigate();
    const location = useLocation();

    const handleGetStarted = () => {
        if (isLoggedIn) {
            handleNavigate('/home', 'home');
        } else {
            navigate('/login-signup');
        }
    };

    const handleNavigate = (path: string, buttonName: string) => {
        navigate(path);
        setActiveButton(buttonName);
        setShowDropdown(false);
    };

    useEffect(() => {
        if (location.pathname === '/landing') {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <div className="landing-scroll-wrapper">
            {/* HERO SECTION */}
            <section className="landing-hero-section">
                <video className="video-bg" autoPlay muted loop>
                    <source src={landingVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                <div className="hero-overlay glass-card">
                    <div className="fade-text">
                        <h2 className="hero-title">Brain Tumor Detection Using Artificial Intelligence</h2>
                        <p className="hero-subtitle">
                            Upload MRI scans to detect brain tumors using advanced deep learning algorithms.
                            Fast, accurate, and reliable.
                        </p>
                        <button onClick={handleGetStarted} className="hero-button">
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            {/* ORIGINAL CONTENT */}
            <section className="landing-content-section">
                <About />
                <HowItWorks />
                <TestimonialCarousel />
                <LandingStats />
                <FAQ />
            </section>

            {/* FOOTER */}
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default Landing;
