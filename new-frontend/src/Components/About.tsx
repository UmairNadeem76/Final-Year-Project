import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-container">
            <h1>Some Vital Information On Brain Tumor</h1>
            <p>Brain tumors are among the most dangerous medical conditions, affecting thousands of individuals worldwide each year. Brain tumors can be classified as either benign or malignant, with malignant tumors posing a significant risk to a person's health and survival. According to the World Health Organization (WHO), over 200,000 cases of brain tumors are diagnosed annually, with malignant brain tumors accounting for approximately 25% of all cancer-related deaths. In fact, brain cancer has one of the lowest survival rates among all cancer types, with a 5-year survival rate of only 35%.
                The symptoms of brain tumors are often vague and can be mistaken for other less serious health conditions, making early detection crucial. If left undiagnosed or untreated, brain tumors can lead to severe neurological damage, permanent disability, or even death. Early detection, followed by appropriate medical intervention, is critical for improving the patient's prognosis and quality of life.
                This application was designed to aid in the early detection of brain tumors using advanced AI technology. By analyzing medical imaging such as MRI or CT scans, our AI model is capable of identifying signs of brain tumors at a much earlier stage, allowing healthcare professionals to intervene quickly. With the help of this tool, patients can receive more timely diagnoses, leading to better outcomes and potentially life-saving treatments.</p>
        </div>
    );
};

export default About;
