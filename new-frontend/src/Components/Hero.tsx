import React from 'react'
import './Hero.css'

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <h2 className="hero-title">Brain Tumor Detection Using Artificial Intelligence</h2>
                <p className="hero-subtitle">
                    Upload MRI scans to detect brain tumors using advanced deep learning algorithms. Fast, accurate, and reliable.
                </p>
                <a href="#upload" className="hero-button">
                    Get Started
                </a>
            </div>
        </section>
    )
}

export default Hero
