"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "id";

type TranslationValue = string | ((args: Record<string, string | number>) => string);

type Translations = {
  [key: string]: {
    en: TranslationValue;
    id: TranslationValue;
  };
};

// All translations for the website
export const translations: Translations = {  // Supported By section
  "supported.title": {
    en: "SUPPORTED BY",
    id: "DIDUKUNG OLEH",
  },
  "supported.subtitle": {
    en: "Part of Inbis Primakara's Student Entrepreneurship Program",
    id: "Bagian dari Program Pembinaan Kewirausahaan Mahasiswa Inbis Primakara",
  },

  // Navigation
  "nav.home": {
    en: "Home",
    id: "Beranda",
  },
  "nav.about": {
    en: "About Us",
    id: "Tentang Kami",
  },
  "nav.services": {
    en: "Services",
    id: "Layanan",
  },
  "nav.portfolio": {
    en: "Portfolio",
    id: "Portofolio",
  },
  "nav.blog": {
    en: "Blog",
    id: "Blog",
  },
  "nav.contact": {
    en: "Contact",
    id: "Kontak",
  },

  // Hero section
  "hero.imageAlt": {
    en: "Professional team in a meeting",
    id: "Tim profesional dalam meeting",
  },
  "hero.professionalTeam": {
    en: "Our professional team is ready to help your business",
    id: "Tim profesional kami siap membantu bisnis Anda",
  },
  "hero.title.part1": {
    en: "Empowering the world through",
    id: "Memberdayakan Dunia Dengan",
  },
  "hero.title.highlight": {
    en: "human power",
    id: "Inovasi Manusia",
  },
  "hero.title.part2": {
    en: "and technology",
    id: "dan Teknologi Terkini",
  },
  "hero.subtitle": {
    en: "Web Design, Mobile Apps, Online Promotion in Indonesia",
    id: "Desain Web, Aplikasi Mobile, Promosi Online di Indonesia",
  },
  "hero.cta.consultation": {
    en: "Free Consultation",
    id: "Konsultasi Gratis",
  },
  "hero.cta.portfolio": {
    en: "Our Portfolio",
    id: "Portofolio Kami",
  },
  "hero.scrollText": {
    en: "Scroll for more",
    id: "Scroll untuk selengkapnya",
  },

  // Services section

  "services.mainTitle.line1": {
    en: "Digital Work",
    id: "Karya Digital"
  },
  "services.mainTitle.line2": {
    en: "From Us For",
    id: "Dari Kami Untuk"
  },
  "services.mainTitle.highlight": {
    en: "The Best Results",
    id: "Hasil Terbaik"
  },
  "services.website.title": {
    en: "Website Development",
    id: "Pengembangan Website",
  },
  "services.website.description": {
    en: "Website creation is our expertise. As experts in this field, we don't just 'make websites', but we also care about how your website is managed, security, SEO, and UI/UX implementation.",
    id: "Pembuatan website adalah keahlian kami. Sebagai expert dalam bidang ini kami tidak \"asal bikin website\", tetapi kami juga peduli dengan cara website Anda dikelola, keamanan, SEO, dan UI/UX yang diimplementasikan.",
  },
  "services.website.readMore": {
    en: "READ MORE",
    id: "BACA SELENGKAPNYA",
  },
  "services.website.imageAlt": {
    en: "Website development",
    id: "Pengembangan website",
  },
  "services.website.mobileViewAlt": {
    en: "Mobile view",
    id: "Tampilan mobile",
  },
  "services.mobile.title": {
    en: "Mobile App Development",
    id: "Pengembangan Aplikasi Mobile",
  },
  "services.mobile.description": {
    en: "Indonesia has now entered the era of mobile applications. With the widespread use of smartphones, we can access the internet anytime and anywhere. Our development team can turn your ideas into application works that can be featured on the Apple Store or Google Play.",
    id: "Indonesia kini memasuki era aplikasi mobile. Dengan meluasnya penggunaan smartphone, kita bisa mengakses internet kapan saja dan dimana saja. Tim pengembang kami bisa membuat ide milik Anda menjadi suatu karya aplikasi yang dimuat di Apple Store ataupun Google Play.",
  },
  "services.mobile.readMore": {
    en: "READ MORE",
    id: "BACA SELENGKAPNYA",
  },

  // Challenges Section
  "challenges.badge": {
    en: "OUR CHALLENGES",
    id: "TANTANGAN KAMI",
  },
  "challenges.title.main": {
    en: "Digital Solutions for",
    id: "Solusi Digital untuk",
  },
  "challenges.title.highlight": {
    en: "Modern Business",
    id: "Bisnis Modern",
  },
  "challenges.subtitle": {
    en: "Helping your business grow in the digital era with the right and innovative solutions",
    id: "Membantu bisnis Anda bertumbuh di era digital dengan solusi yang tepat dan inovatif",
  },
  "challenges.indonesia.title": {
    en: "Digital Challenges in Indonesia",
    id: "Tantangan Digital di Indonesia",
  },
  "challenges.indonesia.paragraph1": {
    en: "Indonesia, as the largest archipelagic country in the world, with more than 17,000 islands, presents unique challenges in digital transformation. Uneven access to technology, limited infrastructure in some areas, and diverse business needs are obstacles for many companies.",
    id: "Indonesia sebagai negara kepulauan terbesar di dunia, dengan lebih dari 17.000 pulau, menghadirkan tantangan unik dalam transformasi digital. Akses teknologi yang tidak merata, infrastruktur yang terbatas di beberapa wilayah, serta kebutuhan bisnis yang beragam menjadi kendala bagi banyak perusahaan.",
  },
  "challenges.indonesia.paragraph2": {
    en: "Bajramedia is here to bridge the digital divide, providing technology solutions that are accessible and beneficial for all business scales, from MSMEs to large corporations.",
    id: "Bajramedia hadir untuk menjembatani kesenjangan digital tersebut, menyediakan solusi teknologi yang dapat diakses dan bermanfaat bagi semua skala bisnis, dari UMKM hingga perusahaan besar.",
  },
  "challenges.stats.projects.value": {
    en: "50+",
    id: "50+",
  },
  "challenges.stats.projects.label": {
    en: "Projects Completed",
    id: "Proyek Selesai",
  },
  "challenges.stats.experience.value": {
    en: "10+",
    id: "10+",
  },
  "challenges.stats.experience.label": {
    en: "Years of Experience",
    id: "Tahun Pengalaman",
  },
  "challenges.stats.satisfaction.value": {
    en: "98%",
    id: "98%",
  },
  "challenges.stats.satisfaction.label": {
    en: "Satisfied Clients",
    id: "Klien Puas",
  },
  "challenges.map.card1.title": {
    en: "Service Coverage",
    id: "Cakupan Layanan",
  },
  "challenges.map.card1.text": {
    en: "Digital solutions for all regions of Indonesia",
    id: "Solusi digital untuk seluruh wilayah Indonesia",
  },
  "challenges.map.card2.title": {
    en: "Our Values",
    id: "Nilai Kami",
  },
  "challenges.map.card2.tag1": {
    en: "Innovative",
    id: "Inovatif",
  },
  "challenges.map.card2.tag2": {
    en: "Trusted",
    id: "Terpercaya",
  },
  "challenges.bottomCard.teamLabel": {
    en: "Professional Team",
    id: "Tim Profesional",
  },
  "challenges.bottomCard.learnMore": {
    en: "Learn More",
    id: "Pelajari Selengkapnya",
  },

  // Portfolio Section
  "portfolio.title.main": {
    en: "Featured",
    id: "Portofolio",
  },
  "portfolio.title.highlight": {
    en: "Portfolio",
    id: "Unggulan",
  },
  "portfolio.subtitle": {
    en: "Some of the works and projects we have completed for our clients",
    id: "Beberapa hasil karya dan proyek yang telah kami kerjakan untuk klien kami",
  },
  "portfolio.filter.all": {
    en: "All",
    id: "Semua",
  },
  "portfolio.filter.website": {
    en: "Website",
    id: "Website",
  },
  "portfolio.filter.mobileApp": {
    en: "Mobile App",
    id: "Mobile App",
  },
  "portfolio.filter.digitalMarketing": {
    en: "Digital Marketing",
    id: "Digital Marketing",
  },
  "portfolio.item.alt": {
    en: (args: Record<string, any>) => `Portfolio project ${args.number}`,
    id: (args: Record<string, any>) => `Proyek portofolio ${args.number}`,
  },
  "portfolio.item.titleOverlay": {
    en: (args: Record<string, any>) => `Website Project ${args.number}`,
    id: (args: Record<string, any>) => `Proyek Website ${args.number}`,
  },
  "portfolio.item.title": {
    en: (args: Record<string, any>) => `Website Project ${args.number}`,
    id: (args: Record<string, any>) => `Proyek Website ${args.number}`,
  },
  "portfolio.item.categoryDefault": {
    en: "Website, Digital Marketing",
    id: "Website, Digital Marketing",
  },
  "portfolio.viewAll": {
    en: "View All Portfolio",
    id: "Lihat Semua Portofolio",
  },

  // Testimonials Section
  "testimonials.title.main": {
    en: "Client",
    id: "Testimonial",
  },
  "testimonials.title.highlight": {
    en: "Testimonials",
    id: "Klien",
  },
  "testimonials.subtitle": {
    en: "What those who have worked with our team say",
    id: "Apa kata mereka yang telah bekerja sama dengan tim kami",
  },
  "testimonials.client1.name": {
    en: "Ahmad Satrio",
    id: "Ahmad Satrio",
  },
  "testimonials.client1.role": {
    en: "CEO, PT Maju Bersama",
    id: "CEO, PT Maju Bersama",
  },
  "testimonials.client1.quote": {
    en: "The Bajramedia team is very professional and responsive. Our website now looks modern and our business performance has improved significantly.",
    id: "Tim Bajramedia sangat profesional dan responsif. Website kami sekarang terlihat modern dan performa bisnis kami meningkat signifikan.",
  },
  "testimonials.client2.name": {
    en: "Siti Rahma",
    id: "Siti Rahma",
  },
  "testimonials.client2.role": {
    en: "Marketing Director, Toko Sejahtera",
    id: "Marketing Director, Toko Sejahtera",
  },
  "testimonials.client2.quote": {
    en: "The mobile application created by Bajramedia greatly facilitates our customers in shopping. The user interface is intuitive and easy to use.",
    id: "Aplikasi mobile yang dibuat oleh Bajramedia sangat memudahkan pelanggan kami dalam berbelanja. User interface-nya intuitif dan mudah digunakan.",
  },
  "testimonials.client3.name": {
    en: "Budi Santoso",
    id: "Budi Santoso",
  },
  "testimonials.client3.role": {
    en: "Owner, Resto Nikmat",
    id: "Owner, Resto Nikmat",
  },
  "testimonials.client3.quote": {
    en: "The digital marketing strategy designed by Bajramedia successfully increased our online sales by 200% in 6 months. Very satisfying!",
    id: "Strategi digital marketing yang dirancang oleh Bajramedia berhasil meningkatkan penjualan online kami hingga 200% dalam 6 bulan. Sangat memuaskan!",
  },

  // Contact Section
  "contact.header.main": {
    en: "Contact",
    id: "Hubungi",
  },
  "contact.header.highlight": {
    en: "Us",
    id: "Kami",
  },
  "contact.subheader": {
    en: "Contact us for a free consultation or questions about our services. Our team is ready to help you.",
    id: "Hubungi kami untuk konsultasi gratis atau pertanyaan seputar layanan kami. Tim kami siap membantu Anda.",
  },
  "contact.address.title": {
    en: "Address",
    id: "Alamat",
  },
  "contact.address.text": {
    en: "Jl. Kesana kemari",
    id: "Jl. Kesana kemari",
  },
  "contact.phone.title": {
    en: "Phone",
    id: "Telepon",
  },
  "contact.phone.text": {
    en: "+62 000000",
    id: "+62 000000",
  },
  "contact.email.title": {
    en: "Email",
    id: "Email",
  },
  "contact.email.text": {
    en: "bajramedia.com",
    id: "bajramedia.com",
  },
  "contact.social.title": {
    en: "Follow Us",
    id: "Ikuti Kami",
  },
  "contact.title": { // Form title
    en: "Send Message",
    id: "Kirim Pesan",
  },
  "contact.name": {
    en: "Name",
    id: "Nama",
  },
  "contact.email": { // Form field label
    en: "Email",
    id: "Email",
  },
  "contact.subject": {
    en: "Subject",
    id: "Subjek",
  },  "contact.message": {
    en: "Message",
    id: "Pesan",
  },
  "contact.placeholderName": {
    en: "Full name",
    id: "Nama lengkap",
  },
  "contact.placeholderEmail": {
    en: "Your email",
    id: "Email anda",
  },
  "contact.placeholderSubject": {
    en: "Message subject",
    id: "Subjek pesan",
  },
  "contact.placeholderMessage": {
    en: "Write your message here...",
    id: "Tulis pesan Anda di sini...",
  },
  "contact.send": {
    en: "Send Message",
    id: "Kirim Pesan",
  },
  "contact.badge": {
    en: "GET IN TOUCH",
    id: "HUBUNGI KAMI",
  },
  "contact.submit": {
    en: "Submit",
    id: "Kirim",
  },
  "contact.support": {
    en: "Support",
    id: "Dukungan",
  },
  
  // Footer Section
  "footer.description": {
    en: "Building technology that creates value for your business. Integrated digital solutions for company growth.",
    id: "Membangun teknologi yang menciptakan nilai untuk bisnis Anda. Solusi digital terintegrasi untuk pertumbuhan perusahaan.",
  },
  "footer.company": {
    en: "Company",
    id: "Perusahaan",
  },
  "footer.services": {
    en: "Services",
    id: "Layanan",
  },
  "footer.newsletter": {
    en: "Newsletter",
    id: "Newsletter",
  },
  "footer.subscribeText": {
    en: "Subscribe for news and latest updates.",
    id: "Berlangganan untuk berita dan update terbaru.",
  },
  "footer.emailPlaceholder": {
    en: "Your Email",
    id: "Email Anda",
  },
  "footer.subscribe": {
    en: "Subscribe",
    id: "Berlangganan",
  },
  "footer.rightsReserved": {
    en: "All Rights Reserved",
    id: "Hak Cipta Dilindungi",
  },
  "footer.terms": {
    en: "Terms & Conditions",
    id: "Syarat & Ketentuan",
  },
  "footer.privacy": {
    en: "Privacy Policy",
    id: "Kebijakan Privasi",
  },
  "footer.cookies": {
    en: "Cookies",
    id: "Cookies",
  },
  "footer.links.about": {
    en: "About Us",
    id: "Tentang Kami",
  },
  "footer.links.careers": {
    en: "Careers",
    id: "Karir",
  },
  "footer.links.blog": {
    en: "Blog",
    id: "Blog",
  },
  "footer.links.partners": {
    en: "Partners",
    id: "Mitra",
  },
  "footer.services.webDevelopment": {
    en: "Web Development",
    id: "Pengembangan Web",
  },
  "footer.services.mobileDevelopment": {
    en: "Mobile Development",
    id: "Pengembangan Mobile",
  },  "footer.services.uiDesign": {
    en: "UI/UX Design",
    id: "Desain UI/UX",
  },  
  "footer.services.consultation": {
    en: "Consultation",
    id: "Konsultasi",
  },

  // Supported By Section
  "inbis.officialCollaboration": {
    en: "Bajramedia is proudly incubated by Inbis Primakara",
    id: "Bajramedia dibina langsung oleh Inbis Primakara",
  },
  "inbis.partnershipDescription": {
    en: "hrough a hands-on entrepreneurship program and intensive mentorship. We've grown with clear direction and strong startup support.",
    id: "melalui program kewirausahaan dan mentorship intensif. Kami tumbuh dengan arahan yang jelas dan dukungan dari ekosistem startup yang solid."
  },
  
  // CTA Section
  "cta.title": {
    en: "Ready to Transform Your Digital Presence?",
    id: "Siap Transformasikan Kehadiran Digital Anda?",
  },
  "cta.description": {
    en: "Let us help you build beautiful, functional, and effective digital solutions that drive results for your business. Start your journey with us today.",
    id: "Biarkan kami membantu Anda membangun solusi digital yang indah, fungsional, dan efektif yang mendorong hasil untuk bisnis Anda. Mulai perjalanan Anda bersama kami hari ini.",
  },
  "cta.primaryButton": {
    en: "Start Your Project",
    id: "Mulai Proyek Anda",
  },  "cta.secondaryButton": {
    en: "Contact Us",
    id: "Hubungi Kami",
  },

  // Blog section
  "blog.label": {
    en: "Our Blog",
    id: "Blog Kami",
  },
  "blog.title": {
    en: "Latest Insights & Articles",
    id: "Artikel & Wawasan Terbaru",
  },
  "blog.description": {
    en: "Stay updated with our latest thinking on digital strategy, design trends, technology innovations, and more.",
    id: "Tetap up to date dengan pemikiran terbaru kami tentang strategi digital, tren desain, inovasi teknologi, dan lainnya.",
  },  "blog.viewAllButton": {
    en: "View All Articles",
    id: "Lihat Semua Artikel",
  },
  "blog.noPosts": {
    en: "No blog posts found",
    id: "Tidak ada artikel blog ditemukan",
  },
  "blog.noPostsDescription": {
    en: "We'll be adding new content soon. Please check back later!",
    id: "Kami akan menambahkan konten baru segera. Silakan periksa kembali nanti!",
  },
  "blog.noSearchResults": {
    en: "Try using different keywords or browse all articles",
    id: "Coba gunakan kata kunci yang berbeda atau jelajahi semua artikel",
  },
  "blog.pageTitle": {
    en: "Our Blog",
    id: "Blog Kami",
  },
  "blog.pageDescription": {
    en: "Explore our collection of articles, insights and resources on digital marketing, design, development and more.",
    id: "Jelajahi koleksi artikel, wawasan, dan sumber daya kami tentang pemasaran digital, desain, pengembangan, dan banyak lagi.",
  },
  "blog.searchPlaceholder": {
    en: "Search articles...",
    id: "Cari artikel...",
  },
  "blog.postNotFound": {
    en: "Blog Post Not Found",
    id: "Artikel Blog Tidak Ditemukan",
  },
  "blog.postNotFoundDescription": {
    en: "The blog post you are looking for does not exist or has been removed.",
    id: "Artikel blog yang Anda cari tidak ada atau telah dihapus.",
  },
  "blog.backToBlog": {
    en: "Back to Blog",
    id: "Kembali ke Blog",
  },
  "blog.readTime": {
    en: "min read",
    id: "menit membaca",
  },
  "blog.sharePost": {
    en: "Share this post:",
    id: "Bagikan artikel ini:",
  },
  "blog.relatedPosts": {
    en: "Related Posts",
    id: "Artikel Terkait",
  },
  "blog.previous": {
    en: "Previous",
    id: "Sebelumnya",
  },
  "blog.next": {
    en: "Next",
    id: "Berikutnya",
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isChanging: boolean;
  t: (key: string, args?: Record<string, string | number>) => string;
}

const defaultContext: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  isChanging: false,
  t: (key: string) => key,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [isChanging, setIsChanging] = useState(false);

  // Enhanced setLanguage with smooth transition
  const handleSetLanguage = (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setIsChanging(true);
    
    // Add a small delay for smooth transition effect
    setTimeout(() => {
      setLanguage(newLanguage);
      setTimeout(() => {
        setIsChanging(false);
      }, 150); // Duration matches CSS transition
    }, 150);
  };

  // Load saved language preference from localStorage on client
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "id")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function
  const t = (key: string, args?: Record<string, string | number>): string => {
    const translationEntry = translations[key];
    if (translationEntry) {
      const translationText = translationEntry[language];
      if (typeof translationText === 'function') {
        return translationText(args || {});
      }
      // Ensure to return string even if it's not a function type by definition but is a string
      return String(translationText);
    }
    console.warn(`Translation missing for key: ${key}`);
    return key;
  };
  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isChanging, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
