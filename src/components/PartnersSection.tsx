"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Partner {
    id: string;
    name: string;
    logo: string;
    website: string;
    type: string; // 'Strategic Partner' atau 'Technology Partner'
    description: string;
}

export default function PartnersSection() {
    const { language } = useLanguage();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [partnersLoading, setPartnersLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch('/api/partners');
                if (response.ok) {
                    const data = await response.json();
                    setPartners(data || []);
                }
            } catch (error) {
                console.error('Error fetching partners:', error);
            } finally {
                setPartnersLoading(false);
            }
        };

        fetchPartners();
    }, []);

    const mainPartners = partners.filter(p => p.type === 'Strategic Partner').slice(0, 2);
    const otherPartners = partners.filter(p => p.type !== 'Strategic Partner');

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300; // a fixed amount
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };
    
    if (partnersLoading) {
        return <div className="text-center py-16">Loading Partners...</div>;
    }

    if (partners.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white dark:bg-gray-900 z-0"></div>
            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        {language === 'id' ? 'Dipercaya oleh Perusahaan Hebat' : 'Trusted by Great Companies'}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        {language === 'id'
                            ? 'Kami bangga telah berkolaborasi dengan berbagai perusahaan dan organisasi terkemuka.'
                            : 'We are proud to have collaborated with various leading companies and organizations.'}
                    </p>
                </div>

                {/* Main Partners */}
                {mainPartners.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {mainPartners.map((partner) => (
                            <a key={partner.id} href={partner.website} target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    width={200}
                                    height={80}
                                    style={{ objectFit: 'contain' }}
                                    className="filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            </a>
                        ))}
                    </div>
                )}
                
                {/* Other Partners Carousel */}
                {otherPartners.length > 0 && (
                    <div className="relative">
                         <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">{language === 'id' ? 'Dan Partner Lainnya' : 'And Other Partners'}</h3>
                        <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide space-x-8 pb-4">
                            {otherPartners.map((partner) => (
                                <div key={partner.id} className="flex-shrink-0 w-48 snap-center">
                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center p-6 h-24 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            width={120}
                                            height={50}
                                            style={{ objectFit: 'contain' }}
                                            className="filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100"
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                        {otherPartners.length > 4 && (
                            <div className="flex justify-center mt-6 space-x-4">
                                <button onClick={() => scroll('left')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                </button>
                                <button onClick={() => scroll('right')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
