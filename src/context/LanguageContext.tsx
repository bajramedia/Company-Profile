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
  "admin.edit": { en: "Edit", id: "Edit" },
  "admin.delete": { en: "Delete", id: "Hapus" },
  "admin.create": { en: "Create", id: "Buat" },
  "admin.update": { en: "Update", id: "Update" },
  "admin.save": { en: "Save", id: "Simpan" },
  "admin.cancel": { en: "Cancel", id: "Batal" },
  "admin.add": { en: "Add", id: "Tambah" },
  "admin.new": { en: "New", id: "Baru" },
  "admin.search": { en: "Search", id: "Cari" },
  "admin.filter": { en: "Filter", id: "Filter" },
  "admin.actions": { en: "Actions", id: "Aksi" },
  "admin.status": { en: "Status", id: "Status" },
  "admin.active": { en: "Active", id: "Aktif" },
  "admin.inactive": { en: "Inactive", id: "Tidak Aktif" },
  "admin.published": { en: "Published", id: "Dipublikasi" },
  "admin.draft": { en: "Draft", id: "Draft" },
  "admin.name": { en: "Name", id: "Nama" },
  "admin.title": { en: "Title", id: "Judul" },
  "admin.description": { en: "Description", id: "Deskripsi" },
  "admin.image": { en: "Image", id: "Gambar" },
  "admin.date": { en: "Date", id: "Tanggal" },
  "admin.author": { en: "Author", id: "Penulis" },
  "admin.category": { en: "Category", id: "Kategori" },
  "admin.tag": { en: "Tag", id: "Tag" },
  "admin.views": { en: "Views", id: "Tampilan" },
  "admin.noDataFound": { en: "No data found", id: "Tidak ada data" },
  "admin.loadingError": { en: "Error loading data", id: "Error memuat data" },
  "admin.tryAgain": { en: "Try again", id: "Coba lagi" },
  "admin.confirmDelete": { en: "Are you sure you want to delete this item?", id: "Apakah Anda yakin ingin menghapus item ini?" },
  "admin.deleteSuccess": { en: "Item deleted successfully", id: "Item berhasil dihapus" },
  "admin.saveSuccess": { en: "Item saved successfully", id: "Item berhasil disimpan" },
  "admin.updateSuccess": { en: "Item updated successfully", id: "Item berhasil diperbarui" },
  "admin.createSuccess": { en: "Item created successfully", id: "Item berhasil dibuat" },
  "admin.tagsManagement": { en: "Tags Management", id: "Manajemen Tag" },
  "admin.tagsDescription": { en: "Create and manage blog tags.", id: "Buat dan kelola tag blog." },
  "admin.editTag": { en: "Edit Tag", id: "Edit Tag" },
  "admin.createNewTag": { en: "Create New Tag", id: "Buat Tag Baru" },
  "admin.tagName": { en: "Tag Name", id: "Nama Tag" },
  "admin.updateTag": { en: "Update Tag", id: "Update Tag" },
  "admin.createTag": { en: "Create Tag", id: "Buat Tag" },
  "admin.addTag": { en: "Add Tag", id: "Tambah Tag" },
  "admin.allTags": { en: "All Tags", id: "Semua Tag" },
  "admin.noTagsFound": { en: "No tags found", id: "Tidak ada tag" },
  "admin.authorsManagement": { en: "Authors Management", id: "Manajemen Penulis" },
  "admin.authorsDescription": { en: "Manage blog authors and contributors.", id: "Kelola penulis blog dan kontributor." },
  "admin.editAuthor": { en: "Edit Author", id: "Edit Penulis" },
  "admin.createNewAuthor": { en: "Create New Author", id: "Buat Penulis Baru" },
  "admin.authorName": { en: "Author Name", id: "Nama Penulis" },
  "admin.authorEmail": { en: "Email", id: "Email" },
  "admin.authorBio": { en: "Bio", id: "Bio" },
  "admin.updateAuthor": { en: "Update Author", id: "Update Penulis" },
  "admin.createAuthor": { en: "Create Author", id: "Buat Penulis" },
  "admin.addAuthor": { en: "Add Author", id: "Tambah Penulis" },
  "admin.allAuthors": { en: "All Authors", id: "Semua Penulis" },
  "admin.noAuthorsFound": { en: "No authors found", id: "Tidak ada penulis" },
  "admin.categoriesManagement": { en: "Categories Management", id: "Manajemen Kategori" },
  "admin.categoriesDescription": { en: "Create and manage categories.", id: "Buat dan kelola kategori." },
  "admin.editCategory": { en: "Edit Category", id: "Edit Kategori" },
  "admin.createNewCategory": { en: "Create New Category", id: "Buat Kategori Baru" },
  "admin.categoryName": { en: "Name", id: "Nama" },
  "admin.categorySlug": { en: "Slug", id: "Slug" },
  "admin.updateCategory": { en: "Update Category", id: "Update Kategori" },
  "admin.createCategory": { en: "Create Category", id: "Buat Kategori" },
  "admin.allCategories": { en: "All Categories", id: "Semua Kategori" },
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
  "portfolio.categories.all": { en: "All Categories", id: "Semua Kategori" },
  "portfolio.categories.webDevelopment": { en: "Web Development", id: "Pengembangan Web" },
  "portfolio.categories.gameAssets": { en: "Game Assets", id: "Aset Game" },
  "portfolio.categories.uiuxDesign": { en: "UI/UX Design", id: "Desain UI/UX" },

  // Hero Section
  "hero.imageAlt": { en: "Bajramedia Team", id: "Tim Bajramedia" },
  "hero.title.part1": { en: "We Build", id: "Kami Membangun" },
  "hero.title.highlight": { en: "Digital Solutions", id: "Solusi Digital" },
  "hero.title.part2": { en: "That Drive Success", id: "Yang Mendorong Kesuksesan" },
  "hero.subtitle": { en: "Transform your business with cutting-edge web development, mobile apps, and digital marketing solutions tailored to your needs.", id: "Transformasikan bisnis Anda dengan pengembangan web terdepan, aplikasi mobile, dan solusi pemasaran digital yang disesuaikan dengan kebutuhan Anda." },
  "hero.cta.consultation": { en: "Get Free Consultation", id: "Konsultasi Gratis" },
  "hero.cta.portfolio": { en: "View Our Portfolio", id: "Lihat Portfolio Kami" },

  // Blog Section
  "blog.badge": { en: "Latest", id: "Terbaru" },
  "blog.title": { en: "Blog & News", id: "Blog & Berita" },
  "blog.subtitle": { en: "Stay updated with the latest trends in technology and digital marketing", id: "Tetap update dengan tren terbaru teknologi dan pemasaran digital" },
  "blog.searchPlaceholder": { en: "Search articles...", id: "Cari artikel..." },
  "blog.label": { en: "Blog", id: "Blog" },
  "blog.description": { en: "Read our latest insights about technology, design, and digital solutions", id: "Baca wawasan terbaru kami tentang teknologi, desain, dan solusi digital" },
  "blog.Button": { en: "Read All Articles", id: "Baca Semua Artikel" },
  "blog.backToBlog": { en: "Back to Blog", id: "Kembali ke Blog" },

  // CTA Section
  "cta.title": { en: "Ready to Start Your Project?", id: "Siap Memulai Proyek Anda?" },
  "cta.description": { en: "Let's discuss your ideas and create something amazing together. Our team is ready to bring your vision to life.", id: "Mari diskusikan ide Anda dan ciptakan sesuatu yang luar biasa bersama. Tim kami siap mewujudkan visi Anda." },
  "cta.primaryButton": { en: "Start Your Project", id: "Mulai Proyek Anda" },
  "cta.secondaryButton": { en: "Get in Touch", id: "Hubungi Kami" },

  // Footer
  "description": { en: "We are a creative digital agency that helps businesses grow through innovative web solutions, mobile applications, and digital marketing strategies.", id: "Kami adalah agensi digital kreatif yang membantu bisnis berkembang melalui solusi web inovatif, aplikasi mobile, dan strategi pemasaran digital." },
  "Follow Us": { en: "Follow Us", id: "Ikuti Kami" },
  "Quick Links": { en: "Quick Links", id: "Tautan Cepat" },
  "Services": { en: "Services", id: "Layanan" },
  "Web Development": { en: "Web Development", id: "Pengembangan Web" },
  "Game Assets": { en: "Game Assets", id: "Aset Game" },
  "Uiux Design": { en: "UI/UX Design", id: "Desain UI/UX" },
  "System Development": { en: "System Development", id: "Pengembangan Sistem" },
  "Social Media": { en: "Social Media Management", id: "Manajemen Media Sosial" },
  "Email": { en: "Email", id: "Email" },
  "Phone": { en: "Phone", id: "Telepon" },
  "Location": { en: "Location", id: "Lokasi" },
  "rightsReserved": { en: "All rights reserved", id: "Semua hak dilindungi" },
  "privacy": { en: "Privacy Policy", id: "Kebijakan Privasi" },
  "terms": { en: "Terms of Service", id: "Syarat Layanan" },
  "Made With": { en: "Made with", id: "Dibuat dengan" },
  "Bajra Team": { en: "by Bajra Team", id: "oleh Tim Bajra" },

  // Services
  "services.website.title": { en: "Web Development", id: "Pengembangan Web" },
  "services.mobile.title": { en: "Mobile App Development", id: "Pengembangan Aplikasi Mobile" },

  // 404 Page
  "404.title": { en: "Page Not Found", id: "Halaman Tidak Ditemukan" },
  "404.description": { en: "Sorry, the page you are looking for could not be found.", id: "Maaf, halaman yang Anda cari tidak dapat ditemukan." },
  "404.backToHome": { en: "Back to Home", id: "Kembali ke Beranda" },
  "404.readBlog": { en: "Read Our Blog", id: "Baca Blog Kami" },
  "404.viewPortfolio": { en: "View Portfolio", id: "Lihat Portfolio" },
  "404.popularPages": { en: "Popular Pages", id: "Halaman Populer" },
  "404.ourServices": { en: "Our Services", id: "Layanan Kami" },
  "404.servicesDescription": { en: "Discover our range of digital solutions", id: "Temukan berbagai solusi digital kami" },
  "404.webDevDescription": { en: "Custom web development solutions", id: "Solusi pengembangan web kustom" },
  "404.mobileDescription": { en: "Native and cross-platform mobile apps", id: "Aplikasi mobile native dan lintas platform" },
  "404.copyright": { en: "© 2024 Bajramedia. All rights reserved.", id: "© 2024 Bajramedia. Semua hak dilindungi." },
  "404.whatsappMessage": { en: "Hello! I'm interested in your services.", id: "Halo! Saya tertarik dengan layanan Anda." },

  // Admin Navigation
  "admin.backToWebsite": { en: "Back to Website", id: "Kembali ke Website" },

  // Team Section
  "team.badge": { en: "Our Team", id: "Tim Kami" },
  "team.title": { en: "Meet Our", id: "Kenali Tim" },
  "team.titleHighlight": { en: "Expert Team", id: "Ahli Kami" },
  "team.subtitle": { en: "Passionate professionals dedicated to bringing your digital vision to life with creativity and expertise.", id: "Profesional berpengalaman yang berdedikasi mewujudkan visi digital Anda dengan kreativitas dan keahlian." },

  // Testimonials Section  
  "testimonials.title.main": { en: "What Our", id: "Apa Kata" },
  "testimonials.title.highlight": { en: "Clients Say", id: "Klien Kami" },
  "testimonials.subtitle": { en: "Don't just take our word for it. Here's what our amazing clients have to say about our work.", id: "Jangan hanya percaya kata kami. Ini yang dikatakan klien luar biasa kami tentang pekerjaan kami." },

  // Portfolio Page
  "portfolio.page.title.main": { en: "Our Amazing", id: "Portfolio" },
  "portfolio.page.title.highlight": { en: "Portfolio", id: "Luar Biasa Kami" },
  "portfolio.page.subtitle": { en: "Showcasing our best work and creative solutions", id: "Menampilkan karya terbaik dan solusi kreatif kami" },
  "portfolio.comingSoon.title": { en: "Amazing Projects Coming Soon!", id: "Proyek Luar Biasa Segera Hadir!" },
  "portfolio.comingSoon.subtitle": { en: "We're working on some fantastic projects that will blow your mind. Stay tuned for our latest creations!", id: "Kami sedang mengerjakan beberapa proyek fantastis yang akan memukau Anda. Nantikan kreasi terbaru kami!" },
  "portfolio.cta.title": { en: "Ready to Start Your Next Project?", id: "Siap Memulai Proyek Selanjutnya?" },
  "portfolio.cta.subtitle": { en: "Let's create something amazing together. Our team is ready to bring your vision to life.", id: "Mari ciptakan sesuatu yang luar biasa bersama. Tim kami siap mewujudkan visi Anda." },
  "portfolio.cta.startProject": { en: "Start Your Project", id: "Mulai Proyek Anda" },
  "portfolio.cta.viewServices": { en: "View Our Services", id: "Lihat Layanan Kami" },

  // Services Page
  "services.page.title.main": { en: "Professional", id: "Layanan" },
  "services.page.title.highlight": { en: "Services", id: "Profesional" },
  "services.page.title.end": { en: "We Offer", id: "Kami" },
  "services.page.subtitle": { en: "Comprehensive digital solutions to grow your business. From websites to mobile apps, we're ready to realize your digital vision with cutting-edge technology.", id: "Solusi digital terpadu untuk mengembangkan bisnis kamu. Dari website hingga aplikasi mobile, kami siap mewujudkan visi digital kamu dengan teknologi terdepan." },

  // Service Details
  "service.webDev.title": { en: "Web Development Professional", id: "Web Development Profesional" },
  "service.webDev.subtitle": { en: "Build modern and responsive websites with cutting-edge technology. From landing pages to complex e-commerce, we're ready to realize your digital vision with optimal performance.", id: "Bangun website modern dan responsif dengan teknologi terdepan. Dari landing page hingga e-commerce kompleks, kami siap mewujudkan visi digital kamu dengan performa optimal." },
  "service.webDev.cta.title": { en: "Ready to Build Your Dream Website?", id: "Siap Membangun Website Impian?" },
  "service.webDev.cta.subtitle": { en: "Free consultation to discuss your website needs. Our expert developer team is ready to help!", id: "Konsultasi gratis untuk membahas kebutuhan website kamu. Tim developer expert siap membantu!" },
  "service.webDev.cta.consultation": { en: "Free Consultation", id: "Konsultasi Gratis" },
  "service.webDev.cta.portfolio": { en: "View Portfolio", id: "Lihat Portfolio" },

  "service.gameAsset.title": { en: "Game Asset Development", id: "Aset Game Development" },
  "service.gameAsset.subtitle": { en: "Create stunning characters, environments, and game assets. From 2D sprites to 3D models, we're ready to make your game more lively and engaging.", id: "Ciptakan karakter, environment, dan asset game yang memukau. Dari 2D sprite hingga 3D models, kami siap buat game kamu jadi lebih hidup dan engaging." },
  "service.gameAsset.sectionTitle": { en: "Game Asset Types", id: "Jenis Asset Game" },
  "service.gameAsset.sectionSubtitle": { en: "High-quality assets for all your game types", id: "Asset berkualitas tinggi untuk semua jenis game kamu" },
  "service.gameAsset.cta.discuss": { en: "Discuss Assets", id: "Diskusi Asset" },
  "service.gameAsset.cta.gallery": { en: "View Gallery", id: "Lihat Gallery" },

  "service.digitalMarketing.title": { en: "Digital Marketing Strategy", id: "Strategi Marketing Digital" },
  "service.digitalMarketing.subtitle": { en: "Increase brand awareness and sales with targeted digital marketing strategies. From social media to Google Ads.", id: "Tingkatkan brand awareness dan penjualan dengan strategi digital marketing yang tepat sasaran. Dari social media hingga Google Ads." },
  "service.digitalMarketing.cta.strategy": { en: "Strategy Consultation", id: "Konsultasi Strategy" },
  "service.digitalMarketing.cta.audit": { en: "Free Audit", id: "Audit Gratis" },

  "service.socialMedia.title": { en: "Social Media Management", id: "Social Media Management" },
  "service.socialMedia.subtitle": { en: "Increase engagement and brand awareness with effective social media strategies. From creative content to professional community management.", id: "Tingkatkan engagement dan brand awareness dengan strategi social media yang tepat. Dari konten kreatif hingga community management yang profesional." },
  "service.socialMedia.cta.audit": { en: "Social Media Audit", id: "Audit Media Sosial" },
  "service.socialMedia.cta.portfolio": { en: "View Portfolio", id: "Lihat Portfolio" },

  "service.consulting.title": { en: "Digital Business Consulting", id: "Konsultasi Bisnis Digital" },
  "service.consulting.subtitle": { en: "Get strategic guidance for your business digital transformation. From strategy to targeted implementation.", id: "Dapatkan panduan strategis untuk transformasi digital bisnis kamu. Dari strategi hingga implementasi yang tepat sasaran." },
  "service.consulting.cta.consultation": { en: "Free Consultation", id: "Konsultasi Gratis" },
  "service.consulting.cta.assessment": { en: "Business Assessment", id: "Assessment Bisnis" },

  // Portfolio Detail Page
  "portfolio.detail.viewWebsite": { en: "View Website", id: "Lihat Website" },
  "portfolio.detail.viewCode": { en: "View Code", id: "Lihat Kode" },
  "portfolio.detail.client": { en: "Client", id: "Klien" },
  "portfolio.detail.duration": { en: "Duration", id: "Durasi" },
  "portfolio.detail.technologies": { en: "Technologies Used", id: "Teknologi yang Digunakan" },
  "portfolio.detail.relatedProjects": { en: "Related Projects", id: "Project Terkait" },
  "portfolio.detail.comingSoon": { en: "Coming Soon", id: "Segera Hadir" },
  "portfolio.detail.comingSoonDesc": { en: "We're adding more awesome projects", id: "Kami sedang menambahkan project-project keren lainnya" },
  "portfolio.detail.viewAll": { en: "View All Portfolio", id: "Lihat Semua Portfolio" },
  "portfolio.detail.featured": { en: "Featured", id: "Unggulan" },
  "portfolio.detail.projectInfo": { en: "Project Information", id: "Informasi Proyek" },

  // About Us Page
  "about.title.main": { en: "About", id: "Tentang" },
  "about.title.highlight": { en: "Bajramedia", id: "Bajramedia" },
  "about.subtitle": { en: "We are a creative digital agency dedicated to helping businesses grow through innovative technology solutions and cutting-edge design.", id: "Kami adalah agensi digital kreatif yang berdedikasi membantu bisnis berkembang melalui solusi teknologi inovatif dan desain terdepan." },

  "about.hero.imageCaption": { en: "Our Creative Team at Work", id: "Tim Kreatif Kami Bekerja" },
  "about.hero.imageDescription": { en: "Collaborating to build amazing digital solutions", id: "Berkolaborasi membangun solusi digital yang luar biasa" },

  // Background section
  "about.background.title": { en: "Our Story", id: "Cerita Kami" },
  "about.background.content1": { en: "Bajramedia was founded with a vision to bridge the gap between traditional businesses and the digital world. We recognized the growing need for UMKM (Micro, Small, and Medium Enterprises) and institutions to embrace digital transformation in this modern era.", id: "Bajramedia didirikan dengan visi untuk menjembatani kesenjangan antara bisnis tradisional dan dunia digital. Kami menyadari kebutuhan yang berkembang bagi UMKM dan institusi untuk merangkul transformasi digital di era modern ini." },
  "about.background.content2": { en: "Starting as a small team of passionate developers and designers, we have grown into a comprehensive digital agency that understands the unique challenges faced by businesses in Indonesia. Our journey began with simple websites, but we quickly evolved to offer complete digital solutions.", id: "Dimulai sebagai tim kecil developer dan desainer yang bersemangat, kami telah berkembang menjadi agensi digital komprehensif yang memahami tantangan unik yang dihadapi bisnis di Indonesia. Perjalanan kami dimulai dengan website sederhana, namun kami dengan cepat berkembang untuk menawarkan solusi digital lengkap." },
  "about.background.content3": { en: "Today, we specialize in web development, mobile applications, UI/UX design, game asset development, and digital marketing strategies. Every project we undertake is driven by our commitment to quality, innovation, and client success.", id: "Hari ini, kami mengkhususkan diri dalam pengembangan web, aplikasi mobile, desain UI/UX, pengembangan aset game, dan strategi pemasaran digital. Setiap proyek yang kami kerjakan didorong oleh komitmen kami terhadap kualitas, inovasi, dan kesuksesan klien." },

  // Vision & Mission
  "about.vision.title": { en: "Our Vision", id: "Visi Kami" },
  "about.vision.content": { en: "To be the leading digital transformation partner for businesses across Indonesia, empowering them to thrive in the digital age through innovative technology solutions and exceptional user experiences.", id: "Menjadi mitra transformasi digital terdepan untuk bisnis di seluruh Indonesia, memberdayakan mereka untuk berkembang di era digital melalui solusi teknologi inovatif dan pengalaman pengguna yang luar biasa." },

  "about.mission.title": { en: "Our Mission", id: "Misi Kami" },
  "about.mission.point1": { en: "Deliver cutting-edge digital solutions that drive business growth and success", id: "Memberikan solusi digital terdepan yang mendorong pertumbuhan dan kesuksesan bisnis" },
  "about.mission.point2": { en: "Foster innovation and creativity in every project we undertake", id: "Memupuk inovasi dan kreativitas dalam setiap proyek yang kami kerjakan" },
  "about.mission.point3": { en: "Build long-lasting partnerships with our clients based on trust and excellence", id: "Membangun kemitraan jangka panjang dengan klien berdasarkan kepercayaan dan keunggulan" },

  // Team section
  "about.team.title": { en: "Meet Our", id: "Kenali Tim" },
  "about.team.titleHighlight": { en: "Expert Team", id: "Ahli Kami" },
  "about.team.subtitle": { en: "Our diverse team of professionals brings together expertise in technology, design, and digital strategy to deliver exceptional results.", id: "Tim profesional kami yang beragam menggabungkan keahlian dalam teknologi, desain, dan strategi digital untuk memberikan hasil yang luar biasa." },
  "about.team.error.title": { en: "Failed to Load Team", id: "Gagal Memuat Tim" },
  "about.team.error.message": { en: "Unable to load team members. Please try again later.", id: "Tidak dapat memuat anggota tim. Silakan coba lagi nanti." },
  "about.team.empty.title": { en: "No Team Members", id: "Belum Ada Tim" },
  "about.team.empty.message": { en: "Team members will appear here once they are added.", id: "Anggota tim akan muncul di sini setelah ditambahkan." },

  // Partners section
  "about.partners.title": { en: "Our", id: "Mitra" },
  "about.partners.titleHighlight": { en: "Partners", id: "Kami" },
  "about.partners.subtitle": { en: "We collaborate with leading institutions and technology partners to deliver the best solutions for our clients.", id: "Kami berkolaborasi dengan institusi terkemuka dan mitra teknologi untuk memberikan solusi terbaik bagi klien kami." },
  "about.partners.visitWebsite": { en: "Visit Website", id: "Kunjungi Website" },
  "about.partners.error.title": { en: "Failed to Load Partners", id: "Gagal Memuat Partner" },
  "about.partners.error.message": { en: "Unable to load partners. Please try again later.", id: "Tidak dapat memuat partner. Silakan coba lagi nanti." },
  "about.partners.empty.title": { en: "No Partners", id: "Belum Ada Partner" },
  "about.partners.empty.message": { en: "Partners will appear here once they are added.", id: "Partner akan muncul di sini setelah ditambahkan." },

  // CTA section
  "about.cta.title": { en: "Ready to Transform Your Business?", id: "Siap Transformasi Bisnis Anda?" },
  "about.cta.subtitle": { en: "Let's discuss how we can help you achieve your digital goals and take your business to the next level.", id: "Mari diskusikan bagaimana kami dapat membantu Anda mencapai tujuan digital dan membawa bisnis ke level selanjutnya." },
  "about.cta.contact": { en: "Get in Touch", id: "Hubungi Kami" },
  "about.cta.portfolio": { en: "View Our Work", id: "Lihat Karya Kami" },

  // Portfolio Demo Data (should be replaced with database content)
  "portfolio.demo.title": { en: "Bajra Media Corporate Website", id: "Website Korporat Bajra Media" },
  "portfolio.demo.description": { en: "Modern corporate website with responsive design and powerful CMS features for easy content management.", id: "Website perusahaan modern dengan design responsif dan fitur CMS yang powerful untuk mengelola konten dengan mudah." },
  "portfolio.demo.content": {
    en: `<p>Bajra Media Corporate Website is an ambitious project we worked on to build a comprehensive digital platform. This website functions not only as a company profile, but also as a dynamic information and blog center.</p>
    
    <h3>Challenge & Solution</h3>
    <p>The client needed a website that not only looked professional, but was also easy to manage by their internal team. We developed a custom CMS that is user-friendly yet powerful.</p>
    
    <h3>Technology Stack</h3>
    <p>We use Next.js 14 for optimal performance, TypeScript for type safety, Tailwind CSS for consistent styling, and modern database management for data efficiency.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>Perfect responsive design on all devices</li>
      <li>Blog CMS with rich text editor</li>
      <li>SEO optimization for good Google rankings</li>
      <li>Dark mode support</li>
      <li>Very fast page load speed</li>
      <li>Intuitive admin dashboard</li>
    </ul>
    
    <h3>Results</h3>
    <p>The website successfully increased organic traffic by 300% in the first 3 months. Loading speed reached 95+ on Google PageSpeed Insights, and bounce rate dropped significantly to 15%.</p>`,

    id: `<p>Bajra Media Corporate Website adalah project ambisius yang kami kerjakan untuk membangun platform digital yang komprehensif. Website ini tidak hanya berfungsi sebagai company profile, tetapi juga sebagai pusat informasi dan blog yang dinamis.</p>
    
    <h3>Challenge & Solution</h3>
    <p>Klien membutuhkan website yang tidak hanya terlihat profesional, tapi juga mudah dikelola oleh tim internal mereka. Kami mengembangkan CMS custom yang user-friendly namun powerful.</p>
    
    <h3>Technology Stack</h3>
    <p>Kami menggunakan Next.js 14 untuk performa optimal, TypeScript untuk type safety, Tailwind CSS untuk styling yang konsisten, dan modern database management untuk efisiensi data.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>Responsive design yang sempurna di semua device</li>
      <li>Blog CMS dengan rich text editor</li>
      <li>SEO optimization untuk ranking Google yang baik</li>
      <li>Dark mode support</li>
      <li>Page load speed yang sangat cepat</li>
      <li>Admin dashboard yang intuitive</li>
    </ul>
    
    <h3>Results</h3>
    <p>Website berhasil meningkatkan traffic organic sebesar 300% dalam 3 bulan pertama. Loading speed mencapai 95+ di Google PageSpeed Insights, dan bounce rate turun signifikan menjadi 15%.</p>`
  },
  "portfolio.demo.client": { en: "Bajra Media", id: "Bajra Media" },
  "portfolio.demo.category": { en: "Web Development", id: "Pengembangan Web" },

  // Portfolio Form - comprehensive translations
  "portfolioForm.basicInfo": { en: "Basic Information", id: "Informasi Dasar" },
  "portfolioForm.projectTitle": { en: "Project Title", id: "Judul Proyek" },
  "portfolioForm.projectTitlePlaceholder": { en: "Enter an amazing project title...", id: "Masukkan judul proyek yang menarik..." },
  "portfolioForm.slug": { en: "URL Slug", id: "URL Slug" },
  "portfolioForm.slugPlaceholder": { en: "project-url-slug", id: "slug-url-proyek" },
  "portfolioForm.clientName": { en: "Client Name", id: "Nama Klien" },
  "portfolioForm.clientNamePlaceholder": { en: "Enter client name...", id: "Masukkan nama klien..." },
  "portfolioForm.category": { en: "Category", id: "Kategori" },
  "portfolioForm.selectCategory": { en: "Select Category", id: "Pilih Kategori" },
  "portfolioForm.shortDescription": { en: "Short Description", id: "Deskripsi Singkat" },
  "portfolioForm.shortDescriptionPlaceholder": { en: "Brief description of the project...", id: "Deskripsi singkat tentang proyek..." },
  "portfolioForm.detailContent": { en: "Detail Content", id: "Konten Detail" },
  "portfolioForm.fullContent": { en: "Full Content", id: "Konten Lengkap" },
  "portfolioForm.fullContentPlaceholder": { en: "Write detailed project description...", id: "Tulis deskripsi proyek secara detail..." },
  "portfolioForm.projectImages": { en: "Project Images", id: "Gambar Proyek" },
  "portfolioForm.mainImage": { en: "Main Image", id: "Gambar Utama" },
  "portfolioForm.additionalImages": { en: "Additional Images", id: "Gambar Tambahan" },
  "portfolioForm.additionalImagesDesc": { en: "Upload additional images to showcase your project", id: "Upload gambar tambahan untuk menampilkan proyek Anda" },
  "portfolioForm.projectLinks": { en: "Project Links", id: "Link Proyek" },
  "portfolioForm.projectUrl": { en: "Project URL", id: "URL Proyek" },
  "portfolioForm.githubUrl": { en: "GitHub URL", id: "URL GitHub" },
  "portfolioForm.timeline": { en: "Timeline", id: "Timeline" },
  "portfolioForm.startDate": { en: "Start Date", id: "Tanggal Mulai" },
  "portfolioForm.endDate": { en: "End Date", id: "Tanggal Selesai" },
  "portfolioForm.technologies": { en: "Technologies", id: "Teknologi" },
  "portfolioForm.settings": { en: "Settings", id: "Pengaturan" },
  "portfolioForm.featuredProject": { en: "Featured Project", id: "Proyek Unggulan" },
  "portfolioForm.featuredProjectDesc": { en: "Mark this project as featured", id: "Tandai proyek ini sebagai unggulan" },
  "portfolioForm.publish": { en: "Publish", id: "Publikasikan" },
  "portfolioForm.publishDesc": { en: "Make this project visible to public", id: "Buat proyek ini terlihat oleh publik" },
  "portfolioForm.cancel": { en: "Cancel", id: "Batal" },
  "portfolioForm.saving": { en: "Saving...", id: "Menyimpan..." },
  "portfolioForm.updating": { en: "Updating...", id: "Mengupdate..." },
  "portfolioForm.saveProject": { en: "Save Project", id: "Simpan Proyek" },
  "portfolioForm.updateProject": { en: "Update Project", id: "Update Proyek" },

  // Validation messages
  "validation.titleRequired": { en: "Title is required", id: "Judul wajib diisi" },
  "validation.slugRequired": { en: "Slug is required", id: "Slug wajib diisi" },
  "validation.descriptionRequired": { en: "Description is required", id: "Deskripsi wajib diisi" },
  "validation.contentRequired": { en: "Content is required", id: "Konten wajib diisi" },
  "validation.featuredImageRequired": { en: "Featured image is required", id: "Gambar utama wajib diisi" },
  "validation.clientNameRequired": { en: "Client name is required", id: "Nama klien wajib diisi" },
  "validation.categoryRequired": { en: "Category is required", id: "Kategori wajib dipilih" },
  "validation.invalidProjectUrl": { en: "Invalid project URL", id: "URL proyek tidak valid" },
  "validation.invalidGithubUrl": { en: "Invalid GitHub URL", id: "URL GitHub tidak valid" },

  // Blog specific keys
  "blog.noPosts": { en: "No posts available", id: "Tidak ada artikel" },
  "blog.loadingPosts": { en: "Loading posts...", id: "Memuat artikel..." },
  "blog.errorLoading": { en: "Error loading posts", id: "Error memuat artikel" },
  "blog.noArticles": { en: "No articles found", id: "Tidak ada artikel ditemukan" },
  "blog.adjustFilter": { en: "Try adjusting your search or filter", id: "Coba sesuaikan pencarian atau filter Anda" },
  "blog.filter.all": { en: "All Categories", id: "Semua Kategori" },
  "blog.trending": { en: "Trending Articles", id: "Artikel Trending" },
  "blog.readMore": { en: "Read More", id: "Baca Selengkapnya" },
  "portfolio.project.viewDetail": { en: "View Details", id: "Lihat Detail" },

  // Missing Testimonials Keys
  "testimonials.1.text": { en: "Working with Bajramedia has been an incredible experience. They delivered a stunning website that exceeded our expectations and helped grow our business significantly.", id: "Bekerja dengan Bajramedia adalah pengalaman yang luar biasa. Mereka memberikan website yang memukau yang melebihi ekspektasi kami dan membantu mengembangkan bisnis kami secara signifikan." },
  "testimonials.1.author": { en: "Sarah Johnson", id: "Sarah Johnson" },
  "testimonials.1.position": { en: "CEO, TechStart Inc.", id: "CEO, TechStart Inc." },
  "testimonials.2.text": { en: "The team at Bajramedia is professional, creative, and delivers exceptional results. Our mobile app has received amazing feedback from users.", id: "Tim di Bajramedia profesional, kreatif, dan memberikan hasil yang luar biasa. Aplikasi mobile kami mendapat feedback yang luar biasa dari pengguna." },
  "testimonials.2.author": { en: "Michael Chen", id: "Michael Chen" },
  "testimonials.2.position": { en: "Founder, AppVenture", id: "Founder, AppVenture" },
  "testimonials.3.text": { en: "Bajramedia transformed our digital presence completely. Their expertise in web development and digital marketing is outstanding.", id: "Bajramedia mengubah kehadiran digital kami sepenuhnya. Keahlian mereka dalam pengembangan web dan pemasaran digital sangat luar biasa." },
  "testimonials.3.author": { en: "Lisa Rodriguez", id: "Lisa Rodriguez" },
  "testimonials.3.position": { en: "Marketing Director, GrowthCorp", id: "Marketing Director, GrowthCorp" },

  // Missing Services Keys
  "services.gameAsset.title": { en: "Game Asset Development", id: "Pengembangan Aset Game" },
  "services.gameAsset.description": { en: "Create stunning 2D and 3D game assets including characters, environments, and props with high-quality designs.", id: "Buat aset game 2D dan 3D yang memukau termasuk karakter, environment, dan props dengan desain berkualitas tinggi." },
  "services.gameAsset.2d.title": { en: "2D Game Assets", id: "Aset Game 2D" },
  "services.gameAsset.2d.price": { en: "Starting from $500", id: "Mulai dari $500" },
  "services.gameAsset.2d.features.characters": { en: "Character sprites & animations", id: "Sprite karakter & animasi" },
  "services.gameAsset.2d.features.animations": { en: "Smooth 2D animations", id: "Animasi 2D yang halus" },
  "services.gameAsset.2d.features.items": { en: "Game items & props", id: "Item game & props" },
  "services.gameAsset.2d.features.backgrounds": { en: "Background environments", id: "Environment background" },
  "services.gameAsset.2d.features.source": { en: "Source files included", id: "File source disertakan" },
  "services.gameAsset.2d.features.revisions": { en: "3 revisions included", id: "3 revisi disertakan" },
  "services.gameAsset.3d.title": { en: "3D Game Assets", id: "Aset Game 3D" },
  "services.gameAsset.3d.price": { en: "Starting from $1000", id: "Mulai dari $1000" },
  "services.gameAsset.3d.features.characters": { en: "3D character models", id: "Model karakter 3D" },
  "services.gameAsset.3d.features.animations": { en: "Rigged animations", id: "Animasi rigged" },
  "services.gameAsset.3d.features.items": { en: "3D items & weapons", id: "Item 3D & senjata" },
  "services.gameAsset.3d.features.environments": { en: "3D environments", id: "Environment 3D" },
  "services.gameAsset.3d.features.textures": { en: "High-res textures", id: "Tekstur high-res" },
  "services.gameAsset.3d.features.source": { en: "Source files included", id: "File source disertakan" },
  "services.gameAsset.3d.features.revisions": { en: "5 revisions included", id: "5 revisi disertakan" },
  "services.gameAsset.3d.features.optimization": { en: "Game-ready optimization", id: "Optimasi game-ready" },

  "services.consulting.title": { en: "Business Consulting", id: "Konsultasi Bisnis" },
  "services.consulting.description": { en: "Strategic guidance for your digital transformation journey with expert consultation and planning.", id: "Panduan strategis untuk perjalanan transformasi digital Anda dengan konsultasi dan perencanaan ahli." },
  "services.consulting.basic.title": { en: "Basic Consultation", id: "Konsultasi Dasar" },
  "services.consulting.basic.price": { en: "$200/session", id: "$200/sesi" },
  "services.consulting.basic.features.session": { en: "1-hour consultation", id: "Konsultasi 1 jam" },
  "services.consulting.basic.features.analysis": { en: "Business analysis", id: "Analisis bisnis" },
  "services.consulting.basic.features.recommendations": { en: "Strategic recommendations", id: "Rekomendasi strategis" },
  "services.consulting.basic.features.report": { en: "Summary report", id: "Laporan ringkasan" },
  "services.consulting.pro.title": { en: "Pro Consultation", id: "Konsultasi Pro" },
  "services.consulting.pro.price": { en: "$500/month", id: "$500/bulan" },
  "services.consulting.pro.features.sessions": { en: "4 consultation sessions", id: "4 sesi konsultasi" },
  "services.consulting.pro.features.analysis": { en: "In-depth analysis", id: "Analisis mendalam" },
  "services.consulting.pro.features.strategy": { en: "Custom strategy plan", id: "Rencana strategi kustom" },
  "services.consulting.pro.features.support": { en: "Email support", id: "Dukungan email" },
  "services.consulting.pro.features.report": { en: "Monthly reports", id: "Laporan bulanan" },
  "services.consulting.enterprise.title": { en: "Enterprise Consultation", id: "Konsultasi Enterprise" },
  "services.consulting.enterprise.price": { en: "Custom pricing", id: "Harga kustom" },
  "services.consulting.enterprise.features.dedicated": { en: "Dedicated consultant", id: "Konsultan khusus" },
  "services.consulting.enterprise.features.unlimited": { en: "Unlimited sessions", id: "Sesi unlimited" },
  "services.consulting.enterprise.features.strategy": { en: "Enterprise strategy", id: "Strategi enterprise" },
  "services.consulting.enterprise.features.priority": { en: "Priority support", id: "Dukungan prioritas" },
  "services.consulting.enterprise.features.report": { en: "Custom reports", id: "Laporan kustom" },

  "services.marketing.title": { en: "Digital Marketing", id: "Pemasaran Digital" },
  "services.marketing.description": { en: "Boost your online presence and drive sales with targeted digital marketing strategies and campaigns.", id: "Tingkatkan kehadiran online Anda dan dorong penjualan dengan strategi dan kampanye pemasaran digital yang tepat sasaran." },
  "services.marketing.basic.title": { en: "Basic Marketing", id: "Pemasaran Dasar" },
  "services.marketing.basic.price": { en: "$800/month", id: "$800/bulan" },
  "services.marketing.basic.features.ads": { en: "Google Ads management", id: "Manajemen Google Ads" },
  "services.marketing.basic.features.keywords": { en: "Keyword research", id: "Riset kata kunci" },
  "services.marketing.basic.features.optimization": { en: "Campaign optimization", id: "Optimasi kampanye" },
  "services.marketing.basic.features.report": { en: "Monthly reports", id: "Laporan bulanan" },
  "services.marketing.pro.title": { en: "Pro Marketing", id: "Pemasaran Pro" },
  "services.marketing.pro.price": { en: "$1500/month", id: "$1500/bulan" },
  "services.marketing.pro.features.ads": { en: "Multi-platform ads", id: "Iklan multi-platform" },
  "services.marketing.pro.features.content": { en: "Content marketing", id: "Pemasaran konten" },
  "services.marketing.pro.features.seo": { en: "SEO optimization", id: "Optimasi SEO" },
  "services.marketing.pro.features.analytics": { en: "Advanced analytics", id: "Analitik lanjutan" },
  "services.marketing.pro.features.report": { en: "Bi-weekly reports", id: "Laporan dua mingguan" },
  "services.marketing.enterprise.title": { en: "Enterprise Marketing", id: "Pemasaran Enterprise" },
  "services.marketing.enterprise.price": { en: "Custom pricing", id: "Harga kustom" },
  "services.marketing.enterprise.features.strategy": { en: "Full marketing strategy", id: "Strategi pemasaran lengkap" },
  "services.marketing.enterprise.features.channels": { en: "All marketing channels", id: "Semua saluran pemasaran" },
  "services.marketing.enterprise.features.automation": { en: "Marketing automation", id: "Otomasi pemasaran" },
  "services.marketing.enterprise.features.dedicated": { en: "Dedicated team", id: "Tim khusus" },
  "services.marketing.enterprise.features.report": { en: "Custom reporting", id: "Laporan kustom" },

  "services.mobile.description": { en: "Build powerful mobile applications for iOS and Android with modern technologies and user-friendly design.", id: "Bangun aplikasi mobile yang powerful untuk iOS dan Android dengan teknologi modern dan desain yang user-friendly." },
  "services.mobile.basic.title": { en: "Basic Mobile App", id: "Aplikasi Mobile Dasar" },
  "services.mobile.basic.price": { en: "Starting from $3000", id: "Mulai dari $3000" },
  "services.mobile.basic.features.platform": { en: "Single platform (iOS/Android)", id: "Platform tunggal (iOS/Android)" },
  "services.mobile.basic.features.screens": { en: "Up to 10 screens", id: "Hingga 10 layar" },
  "services.mobile.basic.features.notification": { en: "Push notifications", id: "Notifikasi push" },
  "services.mobile.basic.features.api": { en: "Basic API integration", id: "Integrasi API dasar" },
  "services.mobile.basic.features.deployment": { en: "App store deployment", id: "Deployment app store" },
  "services.mobile.basic.features.support": { en: "3 months support", id: "3 bulan dukungan" },
  "services.mobile.advanced.title": { en: "Advanced Mobile App", id: "Aplikasi Mobile Lanjutan" },
  "services.mobile.advanced.price": { en: "Starting from $5000", id: "Mulai dari $5000" },
  "services.mobile.advanced.features.platform": { en: "Cross-platform (iOS & Android)", id: "Cross-platform (iOS & Android)" },
  "services.mobile.advanced.features.screens": { en: "Unlimited screens", id: "Layar unlimited" },
  "services.mobile.advanced.features.notification": { en: "Advanced notifications", id: "Notifikasi lanjutan" },
  "services.mobile.advanced.features.api": { en: "Complex API integration", id: "Integrasi API kompleks" },
  "services.mobile.advanced.features.offline": { en: "Offline functionality", id: "Fungsi offline" },
  "services.mobile.advanced.features.admin": { en: "Admin panel", id: "Panel admin" },
  "services.mobile.advanced.features.deployment": { en: "App store deployment", id: "Deployment app store" },
  "services.mobile.advanced.features.support": { en: "6 months support", id: "6 bulan dukungan" },
  "services.mobile.advanced.features.analytics": { en: "Analytics integration", id: "Integrasi analitik" },

  "services.system.title": { en: "System Development", id: "Pengembangan Sistem" },
  "services.system.description": { en: "Build robust and scalable systems for your business needs with modern architecture and best practices.", id: "Bangun sistem yang robust dan scalable untuk kebutuhan bisnis Anda dengan arsitektur modern dan best practices." },
  "services.system.basic.title": { en: "Basic System", id: "Sistem Dasar" },
  "services.system.basic.price": { en: "Starting from $2000", id: "Mulai dari $2000" },
  "services.system.basic.features.management": { en: "Basic management system", id: "Sistem manajemen dasar" },
  "services.system.standard.title": { en: "Standard System", id: "Sistem Standar" },
  "services.system.standard.price": { en: "Starting from $5000", id: "Mulai dari $5000" },
  "services.system.standard.features.fullManagement": { en: "Full management system", id: "Sistem manajemen lengkap" },
  "services.system.premium.title": { en: "Premium System", id: "Sistem Premium" },
  "services.system.premium.price": { en: "Custom pricing", id: "Harga kustom" },
  "services.system.premium.features.enterpriseCustom": { en: "Enterprise custom system", id: "Sistem kustom enterprise" },

  "services.social.title": { en: "Social Media Management", id: "Manajemen Media Sosial" },
  "services.social.description": { en: "Boost your social media presence with professional content creation and community management services.", id: "Tingkatkan kehadiran media sosial Anda dengan layanan pembuatan konten profesional dan manajemen komunitas." },
  "services.social.basic.title": { en: "Basic Social Media", id: "Media Sosial Dasar" },
  "services.social.basic.price": { en: "$500/month", id: "$500/bulan" },
  "services.social.basic.features.posts": { en: "12 posts per month", id: "12 postingan per bulan" },
  "services.social.basic.features.stories": { en: "8 stories per month", id: "8 story per bulan" },
  "services.social.basic.features.design": { en: "Basic design templates", id: "Template desain dasar" },
  "services.social.basic.features.copywriting": { en: "Basic copywriting", id: "Copywriting dasar" },
  "services.social.basic.features.hashtag": { en: "Hashtag research", id: "Riset hashtag" },
  "services.social.basic.features.contentPlanning": { en: "Content planning", id: "Perencanaan konten" },
  "services.social.basic.features.revision": { en: "2 revisions per post", id: "2 revisi per postingan" },
  "services.social.basic.features.report": { en: "Monthly report", id: "Laporan bulanan" },
  "services.social.pro.title": { en: "Pro Social Media", id: "Media Sosial Pro" },
  "services.social.pro.price": { en: "$1000/month", id: "$1000/bulan" },
  "services.social.pro.features.posts": { en: "20 posts per month", id: "20 postingan per bulan" },
  "services.social.pro.features.stories": { en: "15 stories per month", id: "15 story per bulan" },
  "services.social.pro.features.reels": { en: "4 reels per month", id: "4 reels per bulan" },
  "services.social.pro.features.premiumDesign": { en: "Premium design", id: "Desain premium" },
  "services.social.pro.features.copywritingSEO": { en: "SEO copywriting", id: "Copywriting SEO" },
  "services.social.pro.features.keywordResearch": { en: "Keyword research", id: "Riset kata kunci" },
  "services.social.pro.features.calendarStrategy": { en: "Calendar strategy", id: "Strategi kalender" },
  "services.social.pro.features.revision": { en: "3 revisions per post", id: "3 revisi per postingan" },
  "services.social.pro.features.adminEngagement": { en: "Admin engagement", id: "Engagement admin" },
  "services.social.pro.features.reportAnalytics": { en: "Analytics report", id: "Laporan analitik" },
  "services.social.pro.features.consultation": { en: "Monthly consultation", id: "Konsultasi bulanan" },

  "services.uiux.title": { en: "UI/UX Design", id: "Desain UI/UX" },
  "services.uiux.description": { en: "Create stunning and user-friendly interfaces with modern design principles and user experience best practices.", id: "Buat antarmuka yang memukau dan user-friendly dengan prinsip desain modern dan best practices user experience." },
  "services.uiux.basic.title": { en: "Basic UI/UX", id: "UI/UX Dasar" },
  "services.uiux.basic.price": { en: "Starting from $800", id: "Mulai dari $800" },
  "services.uiux.basic.features.pages": { en: "Up to 5 pages", id: "Hingga 5 halaman" },
  "services.uiux.basic.features.responsive": { en: "Responsive design", id: "Desain responsif" },
  "services.uiux.basic.features.source": { en: "Source files", id: "File source" },
  "services.uiux.basic.features.revision": { en: "3 revisions", id: "3 revisi" },
  "services.uiux.basic.features.style": { en: "Style guide", id: "Panduan gaya" },
  "services.uiux.standard.title": { en: "Standard UI/UX", id: "UI/UX Standar" },
  "services.uiux.standard.price": { en: "Starting from $1500", id: "Mulai dari $1500" },
  "services.uiux.standard.features.pages": { en: "Up to 15 pages", id: "Hingga 15 halaman" },
  "services.uiux.standard.features.responsive": { en: "Responsive design", id: "Desain responsif" },
  "services.uiux.standard.features.userflow": { en: "User flow diagram", id: "Diagram user flow" },
  "services.uiux.standard.features.prototype": { en: "Interactive prototype", id: "Prototipe interaktif" },
  "services.uiux.standard.features.completeSource": { en: "Complete source files", id: "File source lengkap" },
  "services.uiux.standard.features.revisions": { en: "5 revisions", id: "5 revisi" },
  "services.uiux.standard.features.designSystem": { en: "Design system", id: "Sistem desain" },
  "services.uiux.standard.features.documentation": { en: "Documentation", id: "Dokumentasi" },
  "services.uiux.premium.title": { en: "Premium UI/UX", id: "UI/UX Premium" },
  "services.uiux.premium.price": { en: "Starting from $3000", id: "Mulai dari $3000" },
  "services.uiux.premium.features.pages": { en: "Unlimited pages", id: "Halaman unlimited" },
  "services.uiux.premium.features.responsive": { en: "Responsive design", id: "Desain responsif" },
  "services.uiux.premium.features.userResearch": { en: "User research", id: "Riset pengguna" },
  "services.uiux.premium.features.wireframe": { en: "Wireframe & prototype", id: "Wireframe & prototipe" },
  "services.uiux.premium.features.source": { en: "All source files", id: "Semua file source" },
  "services.uiux.premium.features.revisions": { en: "Unlimited revisions", id: "Revisi unlimited" },
  "services.uiux.premium.features.styleGuide": { en: "Complete style guide", id: "Panduan gaya lengkap" },

  "services.web.title": { en: "Web Development", id: "Pengembangan Web" },
  "services.web.description": { en: "Build modern, responsive, and high-performance websites with cutting-edge technologies and best practices.", id: "Bangun website modern, responsif, dan performa tinggi dengan teknologi terdepan dan best practices." },
  "services.web.tech.title": { en: "Technologies We Use", id: "Teknologi yang Kami Gunakan" },
  "services.web.tech.description": { en: "We use the latest technologies to build fast, secure, and scalable web solutions.", id: "Kami menggunakan teknologi terbaru untuk membangun solusi web yang cepat, aman, dan scalable." },
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
