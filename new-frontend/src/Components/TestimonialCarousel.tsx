import React, { useEffect, useRef, useState } from 'react';
import './TestimonialCarousel.css';

const testimonials = [
    {
        quote: '"This platform gave me peace of mind. Quick and reliable results!"',
        author: '- Sarah A., Patient',
    },
    {
        quote: '"An impressive use of AI in healthcare. The dashboard is intuitive and helpful."',
        author: '- Dr. Rizwan, Neurologist',
    },
    {
        quote: '"Easy to use and very accurate. Saved me a lot of stress."',
        author: '- John M., MRI Technician',
    },
    {
        quote: '"Truly a step forward for early tumor detection!"',
        author: '- Dr. Asma R., Radiologist',
    },
];

const TestimonialCarousel: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <section className="testimonial-carousel-section">
            <h2>What People Say About Us</h2>
            <div className="testimonial-carousel">
                {testimonials.map((item, index) => (
                    <div
                        key={index}
                        className={`testimonial-slide ${index === current ? 'active' : ''}`}
                    >
                        <p className="testimonial-quote">{item.quote}</p>
                        <span className="testimonial-author">{item.author}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialCarousel;
