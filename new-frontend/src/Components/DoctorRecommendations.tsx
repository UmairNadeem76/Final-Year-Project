import React, { useState } from 'react';
import './DoctorRecommendations.css';

// Placeholder doctor images - you can replace these with actual doctor photos
import doctor1Img from '../Assets/aneeq.png';
import doctor2Img from '../Assets/doctor.png';
import doctor3Img from '../Assets/doctor.png';
import doctor4Img from '../Assets/doctor.png';
import doctor5Img from '../Assets/doctor.png';
import doctor6Img from '../Assets/doctor.png';

// Background image
import doctorBg from '../Assets/doctorbg1.jpg';

interface Doctor {
    id: number;
    name: string;
    specialization: string;
    img: string;
    phone: string;
    address: string;
    hospital: string;
    experience: string;
}

const DoctorRecommendations: React.FC = () => {
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

    const doctors: Doctor[] = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialization: "Neurologist",
            img: doctor1Img,
            phone: "+92 300 1234567",
            address: "Suite 15, Medical Plaza, Block 6, PECHS, Karachi",
            hospital: "Aga Khan University Hospital",
            experience: "15+ Years"
        },
        {
            id: 2,
            name: "Dr. Ahmed Hassan",
            specialization: "Neurosurgeon",
            img: doctor2Img,
            phone: "+92 301 2345678",
            address: "Floor 3, Doctors Tower, Gulshan-e-Iqbal, Karachi",
            hospital: "Jinnah Postgraduate Medical Centre",
            experience: "12+ Years"
        },
        {
            id: 3,
            name: "Dr. Fatima Ali",
            specialization: "Radiologist",
            img: doctor3Img,
            phone: "+92 302 3456789",
            address: "Room 205, Medical Complex, Clifton, Karachi",
            hospital: "Liaquat National Hospital",
            experience: "10+ Years"
        },
        {
            id: 4,
            name: "Dr. Muhammad Khan",
            specialization: "Oncologist",
            img: doctor4Img,
            phone: "+92 303 4567890",
            address: "Unit 8, Healthcare Center, Defence, Karachi",
            hospital: "Shaukat Khanum Memorial Cancer Hospital",
            experience: "18+ Years"
        },
        {
            id: 5,
            name: "Dr. Ayesha Malik",
            specialization: "Neurologist",
            img: doctor5Img,
            phone: "+92 304 5678901",
            address: "Suite 12, Medical Plaza, Saddar, Karachi",
            hospital: "Civil Hospital Karachi",
            experience: "13+ Years"
        },
        {
            id: 6,
            name: "Dr. Usman Ahmed",
            specialization: "Neurosurgeon",
            img: doctor6Img,
            phone: "+92 305 6789012",
            address: "Floor 5, Doctors Building, Nazimabad, Karachi",
            hospital: "Ziauddin University Hospital",
            experience: "16+ Years"
        }
    ];

    const handleFlip = (id: number) => {
        setFlippedCard(prev => (prev === id ? null : id));
    };

    return (
        <div className="doctor-recommendations-container" style={{ backgroundImage: `url(${doctorBg})` }}>
            <div className="doctor-hero-section">
                <h1 className="doctor-title">Recommended Doctors</h1>
                <p className="doctor-subtitle">
                    Connect with experienced medical professionals specializing in brain tumor diagnosis and treatment.
                    All doctors listed here are verified and highly recommended by our medical community.
                </p>
            </div>

            <div className="doctor-grid">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.id}
                        className={`doctor-card ${flippedCard === doctor.id ? 'flipped' : ''}`}
                        onClick={() => handleFlip(doctor.id)}
                    >
                        <div className="doctor-card-inner">
                            <div className="doctor-card-front">
                                <div className="doctor-image-container">
                                    <img src={doctor.img} alt={doctor.name} className="doctor-image" />
                                </div>
                                <div className="doctor-info">
                                    <h3 className="doctor-name">{doctor.name}</h3>
                                    <p className="doctor-specialization">{doctor.specialization}</p>
                                    <p className="doctor-hospital">{doctor.hospital}</p>
                                    <p className="doctor-experience">{doctor.experience} Experience</p>
                                </div>
                                <div className="flip-hint">Click To View Contact Details</div>
                            </div>
                            <div className="doctor-card-back">
                                <div className="contact-info">
                                    <h4>Contact Information</h4>
                                    <div className="contact-item">
                                        <span className="contact-label">Phone:</span>
                                        <span className="contact-value">{doctor.phone}</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-label">Address:</span>
                                        <span className="contact-value">{doctor.address}</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-label">Hospital:</span>
                                        <span className="contact-value">{doctor.hospital}</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-label">Experience:</span>
                                        <span className="contact-value">{doctor.experience}</span>
                                    </div>
                                </div>
                                <div className="flip-hint">Click To View Profile</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="doctor-disclaimer">
                <h3>Important Notice</h3>
                <p>
                    This list contains recommended doctors based on their expertise in neurology and oncology.
                    Please contact the doctors directly to schedule appointments and verify their availability.
                    This platform does not guarantee appointment availability or medical outcomes.
                </p>
            </div>
        </div>
    );
};

export default DoctorRecommendations; 