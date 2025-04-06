import React from 'react'
import './HowItWorks.css'
import { useScrollReveal } from '../hooks/useScrollReveal'

import uploadIcon from '../Assets/brain.png'
import analysisIcon from '../Assets/magnifying_glass.png'
import resultIcon from '../Assets/results.png'

const Step: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => {
    const { ref, isVisible } = useScrollReveal()

    return (
        <div className={`how-step ${isVisible ? 'reveal' : 'hidden'}`} ref={ref}>
            <img src={icon} alt={title} />
            <h3>{title}</h3>
            <p>{desc}</p>
        </div>
    )
}

const HowItWorks: React.FC = () => {
    return (
        <section className="how-wrapper">
            <div className="how-inner">
                <h2 className="how-title">How It Works</h2>
                <div className="how-steps">
                    <Step
                        icon={uploadIcon}
                        title="Upload MRI Image"
                        desc="Upload your brain MRI image in JPEG or PNG format securely."
                    />
                    <Step
                        icon={analysisIcon}
                        title="AI Model Analyzes"
                        desc="Our AI model processes the image and looks for anomalies."
                    />
                    <Step
                        icon={resultIcon}
                        title="Get Instant Results"
                        desc="Instant results, safely stored so you can access them anytime."
                    />
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
