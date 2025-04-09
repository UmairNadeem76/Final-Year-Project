import React, { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import microscopeIcon from '../Assets/microscope.png';
import doctorsIcon from '../Assets/doctor.png';
import certificateIcon from '../Assets/services.png';
import emergencyIcon from '../Assets/emergency.png';
import computerIcon from '../Assets/computer.png';
import './LandingStats.css';

interface FeatureItemProps {
    icon: string;
    title: string;
    desc: string;
    delay?: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, desc, delay = 0 }) => {
    const { ref, isVisible } = useScrollReveal();

    return (
        <div
            className={`feature-item hidden${isVisible ? ' reveal' : ''}`}
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <img src={icon} alt={title} />
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    );
};

interface CounterProps {
    label: string;
    value: number;
    color?: string;
}

const CircularCounter: React.FC<CounterProps> = ({ label, value, color = '#2563eb' }) => {
    const [count, setCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setVisible(true);
        }, { threshold: 0.6 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (visible && count < value) {
            const increment = value / 50;
            const interval = setInterval(() => {
                setCount(prev => {
                    if (prev + increment >= value) {
                        clearInterval(interval);
                        return value;
                    }
                    return prev + increment;
                });
            }, 20);
        }
    }, [visible, value, count]);

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (count / 100) * circumference;

    return (
        <div className="counter" ref={ref}>
            <svg>
                <circle cx="50" cy="50" r={radius}></circle>
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        stroke: color,
                    }}
                ></circle>
            </svg>
            <h3>{Math.round(count)}%</h3>
            <p>{label}</p>
        </div>
    );
};

const LandingStats: React.FC = () => {
    const features = [
        { icon: microscopeIcon, title: 'Advanced Technology', desc: 'We use the latest MRI Scans to keep our model updated.' },
        { icon: doctorsIcon, title: '24/7 Support', desc: 'Our staff is always available for your aid.' },
        { icon: certificateIcon, title: 'Fast & Accurate', desc: 'Quick and reliable tumor identification directly from MRI scans.' },
        { icon: emergencyIcon, title: 'Emergency Care', desc: 'Helps speed up emergency triage and early detection.' },
        { icon: computerIcon, title: 'Simple Interface', desc: 'Easily upload scans, view results, and track history through a clean, user-friendly dashboard.' },
    ];

    return (
        <div className="stats-wrapper">
            <section className="features">
                <h4 className="section-subtitle">Why Choose Us?</h4>
                <h2 className="section-title">Offers For You</h2>
                <div className="feature-grid">
                    {features.map((feature, index) => (
                        <FeatureItem key={feature.title} {...feature} delay={index * 150} />
                    ))}
                </div>
            </section>
            <section className="counters">
                <CircularCounter label="Cases Detected Late" value={80} />
                <CircularCounter label="Accuracy With Early Scans" value={95} />
                <CircularCounter label="Survival Rate If Detected Early" value={62} />
                <CircularCounter label="5-Year Survival Rate" value={35} />
            </section>
        </div>
    );
};

export default LandingStats;
