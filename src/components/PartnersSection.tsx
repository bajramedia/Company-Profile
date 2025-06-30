"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLanguage } from "@/context/LanguageContext";

interface Partner {
    id: string;
    name: string;
    logo: string;
    website: string;
    type: string;
    description: string;
}

export default function PartnersSection() {
    const { language } = useLanguage();
    const [partners, setPartners] = useState<Partner[]>([]);
    const [partnersLoading, setPartnersLoading] = useState(true);

    // Fetch partners from database
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

    if (partnersLoading || partners.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="w-[95%] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {language === 'id' ? 'Partner Kami' : 'Our Partners'}
                    </h3>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {language === 'id'
                            ? 'Dipercaya oleh partner terbaik untuk memberikan solusi digital berkualitas'
                            : 'Trusted by the best partners to deliver quality digital solutions'}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
                    {partners.map((partner) => (
                        <a
                            key={partner.id}
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 min-w-[140px] h-20 backdrop-blur-sm border border-white/10 hover:border-white/20"
                            title={partner.description}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    width={100}
                                    height={50}
                                    style={{ objectFit: 'contain' }}
                                    className="max-w-full max-h-full filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = `<span class="text-white/70 group-hover:text-white font-medium text-base transition-colors">${partner.name}</span>`;
                                        }
                                    }}
                                />
                            </div>
                        </a>
                    ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
}
