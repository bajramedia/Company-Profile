-- =====================================================
-- BAJRAMEDIA DATABASE SCHEMA - SAFE INSTALLATION
-- This script can be run multiple times safely
-- =====================================================

-- About Us Content Management (Safe CREATE)
CREATE TABLE IF NOT EXISTS about_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_key VARCHAR(50) NOT NULL UNIQUE,
    title_en VARCHAR(255) NOT NULL,
    title_id VARCHAR(255) NOT NULL,
    content_en TEXT NOT NULL,
    content_id TEXT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Team Members Management (Safe CREATE)
CREATE TABLE IF NOT EXISTS team_members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    role_en VARCHAR(100) NOT NULL,
    role_id VARCHAR(100) NOT NULL,
    bio_en TEXT,
    bio_id TEXT,
    image_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    instagram_url VARCHAR(255),
    behance_url VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Partners Management (Safe CREATE)
CREATE TABLE IF NOT EXISTS partners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_en VARCHAR(100) NOT NULL,
    name_id VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_id TEXT,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    partner_type ENUM('university', 'company', 'startup', 'government', 'other') DEFAULT 'company',
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Footer Content Management (Safe CREATE)
CREATE TABLE IF NOT EXISTS footer_content (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_key VARCHAR(50) NOT NULL,
    title_en VARCHAR(255),
    title_id VARCHAR(255),
    content_en TEXT,
    content_id TEXT,
    link_url VARCHAR(255),
    icon_name VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Website Settings (Enhanced)
CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site_name VARCHAR(100) NOT NULL DEFAULT 'Bajramedia',
    site_description_en TEXT,
    site_description_id TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_address_en TEXT,
    contact_address_id TEXT,
    social_instagram VARCHAR(255),
    social_linkedin VARCHAR(255),
    social_github VARCHAR(255),
    social_twitter VARCHAR(255),
    social_facebook VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- SAFE DATA INSERTION - Only if data doesn't exist
-- =====================================================

-- Insert About Us Content (Safe INSERT)
INSERT IGNORE INTO about_content (section_key, title_en, title_id, content_en, content_id) VALUES
('background', 'Our Background', 'Latar Belakang Kami', 
'Bajramedia was founded with a vision to empower small and medium enterprises (SMEs) through digital transformation. We believe that every business, regardless of size, deserves access to cutting-edge digital solutions that can drive growth and success.', 
'Bajramedia didirikan dengan visi untuk memberdayakan usaha kecil dan menengah (UKM) melalui transformasi digital. Kami percaya bahwa setiap bisnis, terlepas dari ukurannya, berhak mendapatkan akses ke solusi digital terdepan yang dapat mendorong pertumbuhan dan kesuksesan.'),

('vision', 'Our Vision', 'Visi Kami',
'To be the leading digital transformation partner for businesses across Indonesia, creating innovative solutions that bridge the gap between traditional business practices and modern digital excellence.',
'Menjadi partner transformasi digital terdepan untuk bisnis di seluruh Indonesia, menciptakan solusi inovatif yang menjembatani kesenjangan antara praktik bisnis tradisional dan keunggulan digital modern.'),

('mission', 'Our Mission', 'Misi Kami',
'• Provide accessible and affordable digital solutions for SMEs\n• Foster innovation through cutting-edge technology implementation\n• Build long-term partnerships based on trust and measurable results',
'• Menyediakan solusi digital yang mudah diakses dan terjangkau untuk UKM\n• Mendorong inovasi melalui implementasi teknologi terdepan\n• Membangun kemitraan jangka panjang berdasarkan kepercayaan dan hasil yang terukur');

-- Team Members table ready for real data (no dummy data)
-- Add your real team members through the admin panel

-- Partners table ready for real data (no dummy data)
-- Add your real partners through the admin panel with image upload

-- Insert Footer Content (Safe INSERT)
INSERT IGNORE INTO footer_content (section_key, title_en, title_id, content_en, content_id, sort_order) VALUES
('company_info', 'About Bajramedia', 'Tentang Bajramedia',
'We are a digital solutions agency dedicated to helping businesses thrive in the digital age through innovation and technology.',
'Kami adalah agensi solusi digital yang berdedikasi membantu bisnis berkembang di era digital melalui inovasi dan teknologi.',
1),

('services_footer', 'Our Services', 'Layanan Kami',
'Web Development, Mobile Apps, UI/UX Design, Digital Marketing, System Development, Game Development',
'Pengembangan Web, Aplikasi Mobile, Desain UI/UX, Pemasaran Digital, Pengembangan Sistem, Pengembangan Game',
2),

('quick_links', 'Quick Links', 'Tautan Cepat',
'Home, About, Services, Portfolio, Blog, Contact',
'Beranda, Tentang, Layanan, Portofolio, Blog, Kontak',
3);

-- Insert or Update Settings (Safe UPSERT)
INSERT INTO settings (
    id,
    site_name, 
    site_description_en, 
    site_description_id,
    contact_email, 
    contact_phone,
    contact_address_en,
    contact_address_id,
    social_instagram,
    social_linkedin,
    social_github
) VALUES (
    1,
    'Bajramedia',
    'Digital Solutions Agency - Building the future of business through innovative technology',
    'Agensi Solusi Digital - Membangun masa depan bisnis melalui teknologi inovatif',
    'hello@bajramedia.com',
    '+62 812 3456 7890',
    'Jl. Raya Denpasar No. 123, Bali, Indonesia',
    'Jl. Raya Denpasar No. 123, Bali, Indonesia',
    'https://instagram.com/bajramedia',
    'https://linkedin.com/company/bajramedia',
    'https://github.com/bajramedia'
) ON DUPLICATE KEY UPDATE
    site_name = VALUES(site_name),
    site_description_en = VALUES(site_description_en),
    site_description_id = VALUES(site_description_id),
    contact_email = VALUES(contact_email),
    contact_phone = VALUES(contact_phone),
    contact_address_en = VALUES(contact_address_en),
    contact_address_id = VALUES(contact_address_id),
    social_instagram = VALUES(social_instagram),
    social_linkedin = VALUES(social_linkedin),
    social_github = VALUES(social_github),
    updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if data was inserted successfully
SELECT 'About Content Count:' as Info, COUNT(*) as Count FROM about_content;
SELECT 'Team Members Count:' as Info, COUNT(*) as Count FROM team_members;
SELECT 'Partners Count:' as Info, COUNT(*) as Count FROM partners;
SELECT 'Footer Content Count:' as Info, COUNT(*) as Count FROM footer_content;
SELECT 'Settings Count:' as Info, COUNT(*) as Count FROM settings;

-- Show sample data
SELECT 'ABOUT CONTENT:' as Section;
SELECT id, section_key, title_en, title_id FROM about_content LIMIT 5;

SELECT 'TEAM MEMBERS:' as Section;
SELECT id, name, role_en, role_id, sort_order FROM team_members ORDER BY sort_order LIMIT 5;

SELECT 'PARTNERS:' as Section;
SELECT id, name_en, name_id, partner_type, sort_order FROM partners ORDER BY sort_order LIMIT 5;

-- =====================================================
-- CLEANUP QUERIES (Optional - Use if needed)
-- =====================================================

/*
-- Uncomment these if you need to reset data:

-- DELETE FROM about_content;
-- DELETE FROM team_members;
-- DELETE FROM partners;
-- DELETE FROM footer_content;
-- DELETE FROM settings WHERE id = 1;

-- Reset AUTO_INCREMENT:
-- ALTER TABLE about_content AUTO_INCREMENT = 1;
-- ALTER TABLE team_members AUTO_INCREMENT = 1;
-- ALTER TABLE partners AUTO_INCREMENT = 1;
-- ALTER TABLE footer_content AUTO_INCREMENT = 1;
*/

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '✅ DATABASE SETUP COMPLETE!' as Status, 
       'All tables created and sample data inserted safely.' as Message; 