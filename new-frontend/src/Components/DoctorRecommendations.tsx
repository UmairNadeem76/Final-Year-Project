import React, { useState } from 'react';
import './DoctorRecommendations.css';

// Placeholder doctor images - you can replace these with actual doctor photos
import doctor1Img from '../Assets/Arif.png';
import doctor2Img from '../Assets/Akbar.png';
import doctor3Img from '../Assets/Inayat.png';
import doctor4Img from '../Assets/Mohsin.png';
import doctor5Img from '../Assets/Ghulam.png';
import doctor6Img from '../Assets/Muzafar.png';

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
            name: "Prof. Dr. Arif Herekar",
            specialization: "Neurologist",
            img: doctor1Img,
            phone: "(021) 35833973",
            address: "Clifton, Karachi, Pakistan",
            hospital: "Hilal-E-Ahmar House Hospital",
            experience: "39 Years"
        },
        {
            id: 2,
            name: "Prof. Dr. Akbar Ali Khan",
            specialization: "Professor, Consultant Neurosurgeon",
            img: doctor2Img,
            phone: "0303-5645833 (IMC Hospital)",
            address: "Integrated Medical Care Hospital, Lahore, Pakistan",
            hospital: "Integrated Medical Care (IMC) Hospital",
            experience: "23+ Years"
        },
        {
            id: 3,
            name: "Prof. Dr. Inayat Ullah Khan",
            specialization: "Neurosurgeon",
            img: doctor3Img,
            phone: "(+92) 51-8446666",
            address: "Kulsum Plaza, 2020 Blue Area, Jinnah Avenue, Islamabad, Pakistan",
            hospital: "Kulsoom Int. Hospital",
            experience: "30 Years"
        },
        {
            id: 4,
            name: "Dr. Mohsin Ali Raza",
            specialization: "Neurosurgeon",
            img: doctor4Img,
            phone: "(048) 3225200",
            address: "Sargodha Road, Sargodha, Pakistan",
            hospital: "Ashraf Medical Center",
            experience: "12 Years"
        },
        {
            id: 5,
            name: "Dr. Ghulam Dastgir",
            specialization: "Neurosurgeon",
            img: doctor5Img,
            phone: "0335 4540610",
            address: "Kala Khatai Road, Haji Kot Lahore",
            hospital: "Shah Mohammad Neurosurgery Clinic",
            experience: "28 Years"
        },
        {
            id: 6,
            name: "Asst. Prof. Dr. Muzaffer Uddin",
            specialization: "Neurosurgeon",
            img: doctor6Img,
            phone: "(021) 111 166 177",
            address: "FB Area, Karachi",
            hospital: "Mamji Hospital",
            experience: "27 Years"
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