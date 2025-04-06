import React, { useState } from 'react';
import './Information.css';

import member1Img from '../Assets/shahzaib.png';
import member2Img from '../Assets/ahmed.png';
import member3Img from '../Assets/aneeq.png';
import member4Img from '../Assets/umair.png';

interface Member {
    id: number;
    name: string;
    img: string;
    contribution: string;
}

const Information: React.FC = () => {
    const [flippedCard, setFlippedCard] = useState<number | null>(null);

    const members: Member[] = [
        {
            id: 1,
            name: "Shahzaib Shakir",
            img: member1Img,
            contribution: "Group Leader - Responsible for training, validating, and testing the machine learning model.",
        },
        {
            id: 2,
            name: "Muhammad Ahmed",
            img: member2Img,
            contribution: "General Support - Provided assistance during various phases of the project.",
        },
        {
            id: 3,
            name: "Muhammad Aneeq",
            img: member3Img,
            contribution: "Research & Documentation Support - Assisted with research work, data collection, and technical diagrams.",
        },
        {
            id: 4,
            name: "M. Umair Nadeem",
            img: member4Img,
            contribution: "Full Stack Developer - Responsible for building the frontend, backend integration, and project documentation.",
        },
    ];

    const handleFlip = (id: number) => {
        setFlippedCard(prev => (prev === id ? null : id));
    };

    return (
        <div className="info-container">
            <h1 className="info-title">Meet The Team</h1>
            <div className="card-grid">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className={`card ${flippedCard === member.id ? 'flipped' : ''}`}
                        onClick={() => handleFlip(member.id)}
                    >
                        <div className="card-inner">
                            <div className="card-front">
                                <img src={member.img} alt={member.name} className="member-image" />
                                <h3>{member.name}</h3>
                            </div>
                            <div className="card-back">
                                <p>{member.contribution}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="supervisor-wrapper">
                <h2 className="supervisor-heading">Our Supervisor</h2>
                <h4 className="subheading-small">Ms. Zainab Zakir</h4>
                <div className="supervisor-card-static">
                    <p>
                        We express our deepest gratitude to Ms. Zainab Zakir for her
                        invaluable mentorship, insights, and encouragement throughout the development
                        of this project. Her guidance played a vital role in helping us bring this
                        application to life.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Information;
