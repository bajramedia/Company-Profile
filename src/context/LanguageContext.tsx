"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "id";

// Simplified translations - only UI elements, not content
const translations = {
  // Navigation
  "nav.home": { en: "Home", id: "Beranda" },
  "nav.about": { en: "About Us", id: "Tentang Kami" },
  "nav.services": { en: "Services", id: "Layanan" },
  "nav.portfolio": { en: "Portfolio", id: "Portfolio" },
  "nav.blog": { en: "Blog", id: "Blog" },
  "nav.contact": { en: "Contact", id: "Kontak" },

  // Common UI
  "common.loading": { en: "Loading...", id: "Memuat..." },
  "common.error": { en: "Error", id: "Error" },
  "common.save": { en: "Save", id: "Simpan" },
  "common.cancel": { en: "Cancel", id: "Batal" },
  "common.edit": { en: "Edit", id: "Edit" },
  "common.delete": { en: "Delete", id: "Hapus" },
  "common.create": { en: "Create", id: "Buat" },
  "common.update": { en: "Update", id: "Update" },

  // Admin
  "admin.dashboard": { en: "Dashboard", id: "Dashboard" },
  "admin.posts": { en: "Blog Posts", id: "Artikel Blog" },
  "admin.portfolio": { en: "Portfolio", id: "Portfolio" },
  "admin.authors": { en: "Authors", id: "Penulis" },
  "admin.categories": { en: "Categories", id: "Kategori" },
  "admin.tags": { en: "Tags", id: "Tag" },
  "admin.settings": { en: "Settings", id: "Pengaturan" },
  "admin.logout": { en: "Logout", id: "Keluar" },
  "admin.loading": { en: "Loading...", id: "Memuat..." },
  "admin.categoriesManagement": { en: "Categories Management", id: "Manajemen Kategori" },
  "admin.categoriesDescription": { en: "Create and manage categories.", id: "Buat dan kelola kategori." },
  "admin.editCategory": { en: "Edit Category", id: "Edit Kategori" },
  "admin.createNewCategory": { en: "Create New Category", id: "Buat Kategori Baru" },
  "admin.categoryName": { en: "Name", id: "Nama" },
  "admin.categorySlug": { en: "Slug", id: "Slug" },
  "admin.updateCategory": { en: "Update Category", id: "Update Kategori" },
  "admin.createCategory": { en: "Create Category", id: "Buat Kategori" },
  "admin.allCategories": { en: "All Categories", id: "Semua Kategori" },
  "admin.actions": { en: "Actions", id: "Aksi" },
  "admin.noCategoriesFound": { en: "No categories found", id: "Tidak ada kategori" },

  // Post Form - Basic UI only
  "form.title": { en: "Title", id: "Judul" },
  "form.content": { en: "Content", id: "Konten" },
  "form.excerpt": { en: "Excerpt", id: "Ringkasan" },
  "form.author": { en: "Author", id: "Penulis" },
  "form.category": { en: "Category", id: "Kategori" },
  "form.tags": { en: "Tags", id: "Tag" },
  "form.featuredImage": { en: "Featured Image", id: "Gambar Utama" },
  "form.publish": { en: "Publish", id: "Publikasikan" },
  "form.draft": { en: "Save as Draft", id: "Simpan sebagai Draft" },

  // PostForm specific
  "postForm.content": { en: "Content", id: "Konten" },
  "postForm.settings": { en: "Settings", id: "Pengaturan" },
  "postForm.seo": { en: "SEO", id: "SEO" },
  "postForm.social": { en: "Social", id: "Sosial" },
  "postForm.createNew": { en: "Create New Post", id: "Buat Artikel Baru" },
  "postForm.editPost": { en: "Edit Post", id: "Edit Artikel" },
  "postForm.title": { en: "Post Title", id: "Judul Artikel" },
  "postForm.slug": { en: "URL Slug", id: "URL Slug" },
  "postForm.excerpt": { en: "Excerpt", id: "Ringkasan" },
  "postForm.featuredImage": { en: "Featured Image", id: "Gambar Utama" },
  "postForm.words": { en: "words", id: "kata" },
  "postForm.minRead": { en: "min read", id: "menit baca" },
  "postForm.saved": { en: "Saved", id: "Tersimpan" },
  "postForm.saving": { en: "Saving...", id: "Menyimpan..." },
  "postForm.unsaved": { en: "Unsaved", id: "Belum Tersimpan" },
  "postForm.preview": { en: "Preview", id: "Preview" },
  "postForm.edit": { en: "Edit", id: "Edit" },
  "postForm.cancel": { en: "Cancel", id: "Batal" },
  "postForm.generate": { en: "Generate", id: "Generate" },
  "postForm.titlePlaceholder": { en: "Enter an engaging title...", id: "Masukkan judul yang menarik..." },
  "postForm.slugPlaceholder": { en: "url-friendly-slug", id: "url-ramah-slug" },
  "postForm.excerptPlaceholder": { en: "Write a compelling summary...", id: "Tulis ringkasan menarik..." },

  // Auto-translate UI
  "translate.title": { en: "Auto Translation", id: "Terjemahan Otomatis" },
  "translate.enable": { en: "Enable Auto-Translate", id: "Aktifkan Auto-Translate" },
  "translate.translating": { en: "Translating...", id: "Menerjemahkan..." },
  "translate.success": { en: "Translation completed!", id: "Terjemahan selesai!" },
  "translate.apply": { en: "Apply Translation", id: "Terapkan Terjemahan" },

  // AutoTranslate component keys
  "autoTranslate.title": { en: "Auto Translation", id: "Terjemahan Otomatis" },
  "autoTranslate.description": { en: "Automatically translate content to other languages", id: "Otomatis terjemahkan konten ke bahasa lain" },
  "autoTranslate.enable": { en: "Enable Auto-Translate", id: "Aktifkan Auto-Translate" },
  "autoTranslate.sourceLang": { en: "Source Language", id: "Bahasa Sumber" },
  "autoTranslate.targetLang": { en: "Target Language", id: "Bahasa Target" },
  "autoTranslate.translating": { en: "Translating...", id: "Menerjemahkan..." },
  "autoTranslate.success": { en: "Translation completed!", id: "Terjemahan berhasil!" },
  "autoTranslate.previewTranslation": { en: "Preview Translation", id: "Preview Terjemahan" },
  "autoTranslate.applyTranslation": { en: "Apply Translation", id: "Terapkan Terjemahan" },
  "autoTranslate.cancelTranslation": { en: "Cancel Translation", id: "Batal Terjemahan" },

  // Portfolio keys
  "portfolio.title.main": { en: "Our", id: "Portfolio" },
  "portfolio.title.highlight": { en: "Portfolio", id: "Kami" },
  "portfolio.subtitle": { en: "Explore our latest projects and see how we bring ideas to life with cutting-edge technology and creative solutions.", id: "Jelajahi proyek-proyek terbaru kami dan lihat bagaimana kami mewujudkan ide dengan teknologi terdepan dan solusi kreatif." },
  "portfolio.filter.all": { en: "All", id: "Semua" },
  "portfolio.filter.website": { en: "Website", id: "Website" },
  "portfolio.filter.mobileApp": { en: "Mobile App", id: "Aplikasi Mobile" },
  "portfolio.viewAll": { en: "View All Projects", id: "Lihat Semua Proyek" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isChanging: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to English
  const [language, setLanguage] = useState<Language>("en");
  const [isChanging, setIsChanging] = useState(false);

  // Load language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bajramedia-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference with animation
  const handleSetLanguage = (newLanguage: Language) => {
    if (newLanguage !== language) {
      setIsChanging(true);
      setTimeout(() => {
        setLanguage(newLanguage);
        localStorage.setItem('bajramedia-language', newLanguage);
        setTimeout(() => setIsChanging(false), 100);
      }, 150);
    }
  };

  // Simple translation function
  const t = (key: string): string => {
    const translation = translations[key as keyof typeof translations];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isChanging }}>
      {children}
    </LanguageContext.Provider>
  );
};
