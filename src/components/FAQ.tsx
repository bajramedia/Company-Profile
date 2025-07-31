"use client";

import React, { useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Heading, Text, AnimatedText } from '@/components';
import Link from 'next/link';

// Definisikan tipe untuk setiap item FAQ
interface FAQItem {
  question: string;
  answer: string;
}

// Definisikan tipe untuk setiap kategori layanan
interface ServiceCategory {
  id: string;
  name: string;
  faqs: FAQItem[];
}

// Definisikan data FAQ yang dikelompokkan
const faqData: { [key: string]: ServiceCategory } = {
  id: {
    'web-development': {
      id: 'web-development',
      name: 'Pengembangan Web',
      faqs: [
        {
          question: 'Berapa lama waktu pengerjaan proyek website?',
          answer: 'Waktu pengerjaan bervariasi tergantung kompleksitas proyek. Website company profile biasanya 2-4 minggu, sedangkan web aplikasi kompleks bisa 2-6 bulan. Kami akan memberikan estimasi waktu yang akurat setelah analisis kebutuhan.',
        },
        {
          question: 'Teknologi apa yang Anda gunakan untuk pengembangan web?',
          answer: 'Kami menggunakan teknologi modern dan teruji seperti Next.js, React, Node.js, dan Laravel. Pemilihan teknologi disesuaikan dengan kebutuhan spesifik proyek untuk memastikan performa, keamanan, dan skalabilitas terbaik.',
        },
      ],
    },
    'mobile-apps': {
      id: 'mobile-apps',
      name: 'Aplikasi Mobile',
      faqs: [
        {
          question: 'Apakah Anda mengembangkan aplikasi untuk Android dan iOS?',
          answer: 'Ya, kami mengembangkan aplikasi native dan cross-platform untuk kedua platform, Android dan iOS. Kami menggunakan teknologi seperti React Native dan Flutter untuk efisiensi pengembangan.',
        },
      ],
    },
    'uiux-design': {
        id: 'uiux-design',
        name: 'Desain UI/UX',
        faqs: [
          {
            question: 'Bagaimana proses desain UI/UX di perusahaan Anda?',
            answer: 'Proses kami dimulai dengan riset mendalam tentang pengguna dan kompetitor, dilanjutkan dengan pembuatan wireframe, mockup, hingga prototipe interaktif. Kami fokus pada desain yang fungsional, estetis, dan ramah pengguna.',
          },
        ],
      },
    'general': {
      id: 'general',
      name: 'Umum',
      faqs: [
        {
          question: 'Apakah ada garansi untuk proyek yang dikerjakan?',
          answer: 'Ya, kami memberikan garansi 3 bulan untuk perbaikan bug dan 1 tahun untuk dukungan pemeliharaan. Kami juga menyediakan paket pemeliharaan berkelanjutan dengan harga yang kompetitif.',
        },
        {
          question: 'Bagaimana sistem pembayaran dan apakah bisa dicicil?',
          answer: 'Kami menerima pembayaran dengan sistem cicilan: 30% di awal, 40% saat pengembangan, dan 30% saat selesai. Pembayaran bisa melalui transfer bank, e-wallet, atau gateway pembayaran lainnya.',
        },
        {
          question: 'Apakah bisa request revisi setelah proyek selesai?',
          answer: 'Tentu saja! Kami memberikan 2 kali revisi gratis dalam periode garansi. Revisi tambahan akan dikenakan biaya sesuai dengan kompleksitas perubahan yang diminta.',
        },
      ],
    },
  },
  en: {
    'web-development': {
      id: 'web-development',
      name: 'Web Development',
      faqs: [
        {
          question: 'How long does a website project take?',
          answer: 'The project timeline varies depending on its complexity. A company profile website usually takes 2-4 weeks, while a complex web application can take 2-6 months. We will provide an accurate time estimate after a requirements analysis.',
        },
        {
            question: 'What technologies do you use for web development?',
            answer: 'We use modern and proven technologies like Next.js, React, Node.js, and Laravel. The technology stack is chosen based on the specific project needs to ensure the best performance, security, and scalability.',
        },
      ],
    },
    'mobile-apps': {
      id: 'mobile-apps',
      name: 'Mobile Apps',
      faqs: [
        {
          question: 'Do you develop apps for Android and iOS?',
          answer: 'Yes, we develop native and cross-platform applications for both Android and iOS platforms. We use technologies like React Native and Flutter for development efficiency.',
        },
      ],
    },
    'uiux-design': {
        id: 'uiux-design',
        name: 'UI/UX Design',
        faqs: [
          {
            question: 'What is your UI/UX design process?',
            answer: 'Our process starts with in-depth research on users and competitors, followed by creating wireframes, mockups, and interactive prototypes. We focus on designs that are functional, aesthetic, and user-friendly.',
          },
        ],
      },
    'general': {
      id: 'general',
      name: 'General',
      faqs: [
        {
          question: 'Is there a warranty for the completed project?',
          answer: 'Yes, we provide a 3-month warranty for bug fixing and 1 year of maintenance support. We also offer ongoing maintenance packages at competitive prices.',
        },
        {
          question: 'What is the payment system, and can it be paid in installments?',
          answer: 'We accept payment in installments: 30% upfront, 40% during development, and 30% upon completion. Payments can be made via bank transfer, e-wallet, or other payment gateways.',
        },
        {
          question: 'Can I request revisions after the project is completed?',
          answer: 'Of course! We provide 2 free revisions during the warranty period. Additional revisions will be charged according to the complexity of the requested changes.',
        },
      ],
    },
  },
};

export const FAQ = () => {
    const { language } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState<string>('general');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const currentLangData = faqData[language] || faqData.id;
    const categories = Object.values(currentLangData);
    const filteredFaqs = currentLangData[selectedCategory]?.faqs || [];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.offsetWidth;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <AnimatedText as="div">
                        <span className="text-green-500 font-medium text-sm tracking-wider uppercase mb-4 block">
                            {language === 'id' ? 'Punya Pertanyaan?' : 'Have Questions?'}
                        </span>
                        <Heading variant="h2" color="foreground" className="mb-4 text-3xl md:text-4xl font-extrabold">
                            {language === 'id' ? 'Pertanyaan yang Sering Diajukan' : 'Frequently Asked Questions'}
                        </Heading>
                        <Text color="secondary" className="max-w-3xl mx-auto text-base">
                            {language === 'id'
                                ? 'Temukan jawaban untuk pertanyaan yang paling sering diajukan tentang layanan kami.'
                                : 'Find answers to the most frequently asked questions about our services.'
                            }
                        </Text>
                    </AnimatedText>
                </div>
                
                {/* Filter Buttons */}
                <div className="flex justify-center flex-wrap gap-2 mb-10">
                    {categories.map((cat) => (
                        <Button
                            key={cat.id}
                            variant={selectedCategory === cat.id ? 'primary' : 'outline'}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                        >
                            {cat.name}
                        </Button>
                    ))}
                </div>

                {/* FAQ Horizontal Scroll */}
                <div className="relative">
                    <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide space-x-6 pb-6">
                        {filteredFaqs.map((faq, index) => (
                            <div key={index} className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 snap-center">
                                <AnimatedText as="div">
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 h-full shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </AnimatedText>
                            </div>
                        ))}
                    </div>
                    
                    {/* Scroll Buttons */}
                    <div className="flex justify-center items-center mt-8 space-x-4">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <AnimatedText as="div">
                        <Text color="secondary" className="mb-6 text-base">
                            {language === 'id' ? 'Masih ada pertanyaan lain?' : 'Still have other questions?'}
                        </Text>
                        <Link href="/contact">
                            <Button variant="primary" size="lg" className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300">
                                {language === 'id' ? 'Hubungi Kami' : 'Contact Us'}
                            </Button>
                        </Link>
                    </AnimatedText>
                </div>
            </div>
        </section>
    );
}; 