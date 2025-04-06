import React from 'react';
import './Footer.css';
import logo from '../Assets/logo_footer.png';
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleProtectedNavigate = (path: string) => {
        if (isLoggedIn) {
            navigate(path);
        } else {
            navigate('/login-signup');
        }
    };

    return (
        <footer className="footer-container">
            <div className="footer-section">
                <img src={logo} alt="Brain Logo" className="footer-logo" />
                <h3>Brain Tumor Detection Using AI</h3>
                <p>"AI Sees Beyond The Ordinary - Because Every Life Matters"</p>
            </div>

            <div className="footer-section quick-links">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="/landing">Home</a></li>
                    {!isLoggedIn && <li><a href="/login-signup">Signup & Login</a></li>}
                    <li><button className="footer-link-button" onClick={() => handleProtectedNavigate('/home')}>Upload MRI</button></li>
                    {isLoggedIn && <li><a href="/user">Account Info</a></li>}
                    <li><a href="/contact">Contact Us</a></li>
                    <li><a href="/information">About Us</a></li>
                </ul>
            </div>

            <div className="footer-section contact contact-adjust">
                <h4>Contact</h4>
                <p>Email: support@btd.ai</p>
                <p>Phone: 021-34988000</p>
                <p>Address: ST-16 Main University Rd, Block 5 Gulshan-e-Iqbal, Karachi</p>
            </div>

            <div className="footer-section social follow-us">
                <h4>Follow Us</h4>
                <div className="footer-social-icons">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                </div>
            </div>

            <div className="footer-section">
                <h4>Find Us</h4>
                <iframe
                    title="Google Maps"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.278127356468!2d67.089528!3d24.915673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f32a0f2c3f3%3A0x4fc0a6fd386117f0!2sSir%20Syed%20University%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2s!4v1712140000000!5m2!1sen!2s"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </footer>
    );
};

export default Footer;
