import React from 'react';
import Link from 'next/link';
import { Globe, Smartphone, Palette, BarChart3, Cpu, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button, Heading, Text, AnimatedText } from '@/components';

// Data services
const services = [
  {
    id: 'web-development',
        title: 'Web Development',
        titleId: 'Website Modern & Responsif',
        description: 'Bangun website profesional dengan teknologi terbaru yang cepat, aman, dan mobile-friendly.',
        descriptionEn: 'Build professional websites with the latest technology that are fast, secure, and mobile-friendly.',
        icon: Globe,
        color: 'from-[#00D084] to-[#00B873]',
        features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile First']
  },
  {
    id: 'mobile-apps',
        title: 'Mobile Apps',
        titleId: 'Aplikasi Mobile Modern',
        description: 'Pengembangan aplikasi mobile native dan cross-platform untuk iOS dan Android dengan performa optimal.',
        descriptionEn: 'Native and cross-platform mobile app development for iOS and Android with optimal performance.',
        icon: Smartphone,
        color: 'from-[#00D084] to-[#00B873]',
        features: ['Native Development', 'Cross Platform', 'Performance Optimized', 'App Store Ready']
  },
  {
    id: 'uiux-design',
        title: 'UI/UX Design',
        titleId: 'Desain Interface yang Memukau',
        description: 'Ciptakan pengalaman pengguna yang luar biasa dengan desain yang intuitif dan menarik.',
        descriptionEn: 'Create extraordinary user experiences with intuitive and attractive designs.',
        icon: Palette,
        color: 'from-[#00D084] to-[#00B873]',
        features: ['User Research', 'Wireframing', 'Prototyping', 'Design System']
    },
    {
        id: 'digital-marketing',
        title: 'Digital Marketing',
        titleId: 'Digital Marketing Terpadu',
        description: 'Strategi pemasaran digital yang komprehensif untuk meningkatkan brand awareness dan penjualan.',
        descriptionEn: 'Comprehensive digital marketing strategies to increase brand awareness and sales.',
        icon: BarChart3,
        color: 'from-[#00D084] to-[#00B873]',
        features: ['SEO/SEM', 'Social Media Ads', 'Content Marketing', 'Analytics & Reporting']
  },
  {
    id: 'sistem-development',
        title: 'System Development',
        titleId: 'Sistem Development Enterprise',
        description: 'Bangun sistem enterprise yang scalable untuk workflow bisnis yang kompleks.',
        descriptionEn: 'Build scalable enterprise systems for complex business workflows.',
        icon: Cpu,
        color: 'from-[#00D084] to-[#00B873]',
        features: ['ERP System', 'CRM System', 'Custom Development', 'Integration Support']
    },
    {
        id: 'consulting',
        title: 'Consulting',
        titleId: 'Konsultasi Teknologi & Strategi',
        description: 'Konsultasi teknologi dan strategi digital untuk mengoptimalkan proses bisnis dan transformasi digital.',
        descriptionEn: 'Technology consulting and digital strategy to optimize business processes and digital transformation.',
        icon: Lightbulb,
        color: 'from-[#00D084] to-[#00B873]',
        features: ['Digital Strategy', 'Tech Consultation', 'Process Optimization', 'Business Analysis']
    }
];

interface ServicesOverviewProps {
    showFeatures?: boolean;
    showAllServices?: boolean;
    className?: string;
}

const ServicesOverview: React.FC<ServicesOverviewProps> = ({
    showFeatures = false,
    showAllServices = true,
    className = ''
}) => {
  const { language } = useLanguage();
    const displayedServices = showAllServices ? services : services.slice(0, 3);

  return (
        <section className={`py-20 bg-white dark:bg-gray-900 transition-colors duration-300 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <AnimatedText as="div">
                        <span className="text-[#00D084] font-medium text-sm tracking-wider uppercase mb-6 block">
              {language === 'id' ? 'Layanan Kami' : 'Our Services'}
            </span>
          <Heading variant="h2" color="foreground" className="mb-4 text-[28px] md:text-[32px] lg:text-[36px] font-extrabold">
            {language === 'id' ? 'Solusi Digital Komprehensif' : 'Comprehensive Digital Solutions'}
          </Heading>
                        <Text color="secondary" className="max-w-3xl mx-auto text-base leading-relaxed">
            {language === 'id'
                                ? 'Kami menawarkan berbagai layanan digital yang terintegrasi untuk membantu bisnis Anda berkembang di era digital.'
                                : 'We offer various integrated digital services to help your business thrive in the digital era.'
            }
          </Text>
                    </AnimatedText>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedServices.map((service) => (
                        <AnimatedText key={service.id} as="div">
                            <Link href={`/services/${service.id}`}>
                                <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700 h-full">
                                    {/* Icon */}
                                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                                        <service.icon className="w-8 h-8" />
              </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#00D084] transition-colors">
                                        {language === 'id' ? service.titleId : service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                        {language === 'id' ? service.description : service.descriptionEn}
                                    </p>

                {/* Features */}
                                    {showFeatures && (
                                        <div className="space-y-2 mb-6">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-[#00D084]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                                                </div>
                  ))}
                </div>
                                    )}

                                    {/* Learn More Link */}
                                    <div className="flex items-center text-[#00D084] font-medium group-hover:gap-3 transition-all duration-300">
                                        <span>{language === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}</span>
                                        <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
              </div>
            </div>
                            </Link>
                        </AnimatedText>
          ))}
        </div>

                {!showAllServices && (
                    <div className="text-center mt-12">
                        <AnimatedText as="div">
            <Link href="/services">
                                <Button variant="outline" size="lg" className="px-8 py-4 border-2 border-[#00D084] text-[#00D084] hover:bg-[#00D084] hover:text-white transform hover:scale-105 transition-all duration-300">
                {language === 'id' ? 'Lihat Semua Layanan' : 'View All Services'}
              </Button>
            </Link>
                        </AnimatedText>
          </div>
                )}
      </div>
    </section>
  );
};

export default ServicesOverview; 