/* eslint-disable @typescript-eslint/no-explicit-any */
import { faqs } from '@/lib/constants';
import { useRef, useState } from 'react';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const ref = useRef(null);

    const toggle = (index: any) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <section ref={ref} className="max-w-3xl mx-auto pt-32 pb-16 space-y-8 px-8">
            <h2 className="text-2xl md:text-3xl uppercase tracking-wide text-center font-bold">FAQS</h2>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border rounded-md">
                        <button
                            onClick={() => toggle(index)}
                            className="w-full flex gap-3 cursor-pointer justify-between items-center p-4 font-medium text-left"
                        >
                            <span className='text-sm md:text-base'>{faq.question}</span>
                            <span className="text-xl">{openIndex === index ? '–' : '+'}</span>
                        </button>
                        {openIndex === index && (
                            <div className="px-4 pb-4 text-sm md:text-base">{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}