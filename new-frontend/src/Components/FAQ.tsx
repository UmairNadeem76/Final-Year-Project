import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
    {
        question: 'Is this a diagnostic tool?',
        answer: 'No, this tool is not intended for diagnosis. It assists with early tumor detection using AI analysis of MRI scans.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Yes, all uploaded MRI scans are processed securely and only used for assistance with detection not for any other purposes.'
    },
    {
        question: 'Is this service free of cost?',
        answer: 'Yes, our AI-based tumor detection system is currently free to use for everyone.'
    },
    {
        question: 'What formats are supported?',
        answer: 'We support common image formats including PNG and JPEG for MRI scans.'
    },
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="landing-extras-wrapper">
            <h2 className="faq-title">Frequently Asked Questions</h2>
            <div className="faq-container">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question-wrapper">
                            <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
                            <div className="faq-question">{faq.question}</div>
                        </div>
                        <div className={`faq-answer ${openIndex === index ? 'show' : ''}`}>
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
