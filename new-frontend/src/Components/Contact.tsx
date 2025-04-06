import React, { useState } from 'react';
import './Contact.css';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Real-time validation
        if (value.trim() === '') {
            setErrors({ ...errors, [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is required.` });
        } else {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            name: formData.name ? '' : 'Name Is Required.',
            email: formData.email ? '' : 'Email Is Required.',
            message: formData.message ? '' : 'Message Is Required.',
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== '');
        if (hasErrors) return;

        // Success
        setShowSuccess(true);
        setFormData({ name: '', email: '', message: '' });

        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="contact-container">
            <h1>Contact Us</h1>
            <div className="intro-message">
                <p>Have Any Questions Or Feedback? We Would Love To Hear From You!</p>
            </div>
            <div className="contact-form-container">
                <form onSubmit={handleSubmit}>
                    <input
                        className="contact-input"
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}

                    <input
                        className="contact-input"
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}

                    <textarea
                        className="contact-textarea"
                        name="message"
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                    {errors.message && <div className="error-message">{errors.message}</div>}

                    <button className="contact-submit-button" type="submit">Submit</button>
                </form>
                {showSuccess && <div className="success-popup">Message Sent Successfully! ✅</div>}
            </div>
        </div>
    );
};

export default Contact;
