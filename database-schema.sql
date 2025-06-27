-- ====================================
-- BAJRAMEDIA WEBSITE DATABASE STRUCTURE
-- Complete MySQL Compatible Schema
-- ====================================

-- 1. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  site_name VARCHAR(255) NOT NULL DEFAULT 'Bajramedia',
  site_description_en TEXT,
  site_description_id TEXT,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  contact_address_en TEXT,
  contact_address_id TEXT,
  social_instagram VARCHAR(255),
  social_linkedin VARCHAR(255),
  social_github VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS team_members (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  role_en VARCHAR(255) NOT NULL,
  role_id VARCHAR(255) NOT NULL,
  bio_en TEXT,
  bio_id TEXT,
  image_url VARCHAR(500),
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  instagram_url VARCHAR(255),
  behance_url VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. PARTNERS TABLE
CREATE TABLE IF NOT EXISTS partners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_en VARCHAR(255) NOT NULL,
  name_id VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_id TEXT,
  logo_url VARCHAR(500),
  website_url VARCHAR(255),
  partner_type VARCHAR(100),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. PORTFOLIO ITEMS TABLE (FIXED - MySQL Compatible)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_id VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_id TEXT,
  content_en LONGTEXT,
  content_id LONGTEXT,
  featured_image VARCHAR(500),
  client_name VARCHAR(255),
  project_url VARCHAR(500),
  github_url VARCHAR(500),
  category_en VARCHAR(100),
  category_id VARCHAR(100),
  category_icon VARCHAR(50),
  category_color VARCHAR(7),
  is_featured BOOLEAN DEFAULT FALSE,
  start_date DATE,
  end_date DATE,
  view_count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. PORTFOLIO IMAGES TABLE
CREATE TABLE IF NOT EXISTS portfolio_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  portfolio_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  INDEX idx_portfolio_id (portfolio_id)
);

-- 6. PORTFOLIO TAGS TABLE
CREATE TABLE IF NOT EXISTS portfolio_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  portfolio_id INT NOT NULL,
  tag_name VARCHAR(100) NOT NULL,
  tag_color VARCHAR(7),
  INDEX idx_portfolio_id (portfolio_id)
);

-- 7. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_id VARCHAR(255) NOT NULL,
  excerpt_en TEXT,
  excerpt_id TEXT,
  content_en LONGTEXT,
  content_id LONGTEXT,
  featured_image VARCHAR(500),
  author_name VARCHAR(255),
  category VARCHAR(100),
  tags JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  reading_time INT DEFAULT 5,
  is_published BOOLEAN DEFAULT TRUE,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. ABOUT CONTENT TABLE
CREATE TABLE IF NOT EXISTS about_content (
  id INT PRIMARY KEY AUTO_INCREMENT,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title_en VARCHAR(255),
  title_id VARCHAR(255),
  content_en LONGTEXT,
  content_id LONGTEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================
-- SAMPLE DATA INSERTS
-- ====================================

-- Insert default website settings
INSERT INTO settings (
  site_name, site_description_en, site_description_id, contact_email, contact_phone,
  contact_address_en, contact_address_id, social_instagram, social_linkedin, social_github
) VALUES (
  'Bajramedia',
  'We are a creative digital agency that helps businesses grow through innovative web solutions, mobile applications, and digital marketing strategies.',
  'Kami adalah agensi digital kreatif yang membantu bisnis berkembang melalui solusi web inovatif, aplikasi mobile, dan strategi pemasaran digital.',
  'hello@bajramedia.com',
  '+6285739402436',
  'Denpasar, Bali, Indonesia',
  'Denpasar, Bali, Indonesia',
  'https://instagram.com/bajramedia',
  'https://linkedin.com/company/bajramedia',
  'https://github.com/bajramedia'
);

-- Insert team members
INSERT INTO team_members (name, role_en, role_id, bio_en, bio_id, image_url, linkedin_url, github_url, instagram_url, sort_order) VALUES
('Kadek Adi Wirawan', 'CEO & Founder', 'CEO & Pendiri', 'Visionary leader with 8+ years of experience in digital transformation', 'Pemimpin visioner dengan pengalaman 8+ tahun dalam transformasi digital', '/images/team-meeting.jpg', '#', '#', '#', 1),
('Ni Made Sari Dewi', 'Chief Financial Officer', 'Bendahara', 'Financial expert ensuring sustainable growth and strategic investments', 'Ahli keuangan yang memastikan pertumbuhan berkelanjutan dan investasi strategis', '/images/team-meeting-alt.jpg', '#', NULL, '#', 2),
('I Putu Creative Designer', 'UI/UX Designer', 'Desainer UI/UX', 'Creative designer focused on user-centered design and beautiful interfaces', 'Desainer kreatif yang fokus pada desain yang berpusat pada pengguna dan antarmuka yang indah', '/images/team-meeting-2.jpg', '#', NULL, '#', 3),
('Kadek Social Media', 'Social Media Content Creator', 'Kreator Konten Media Sosial', 'Content strategist creating engaging social media campaigns', 'Strategi konten yang menciptakan kampanye media sosial yang menarik', '/images/team.jpg', NULL, NULL, '#', 4),
('I Made Frontend Dev', 'Frontend Developer', 'Frontend Developer', 'Frontend specialist building responsive and interactive web experiences', 'Spesialis frontend yang membangun pengalaman web responsif dan interaktif', '/images/team-meeting.jpg', '#', '#', NULL, 5),
('I Ketut Backend Pro', 'Backend Developer', 'Backend Developer', 'Backend architect creating robust and scalable server solutions', 'Arsitek backend yang menciptakan solusi server yang kokoh dan scalable', '/images/team-meeting-alt.jpg', '#', '#', NULL, 6);

-- Insert partners
INSERT INTO partners (name_en, name_id, description_en, description_id, logo_url, website_url, partner_type, sort_order) VALUES
('Primakara University', 'Universitas Primakara', 'Leading technology university partnership for innovation and research', 'Kemitraan universitas teknologi terdepan untuk inovasi dan penelitian', '/images/inbis-primakara-logo.svg', 'https://primakara.ac.id', 'Education Partner', 1),
('Recevdov', 'Recevdov', 'Technology partner for advanced development solutions', 'Mitra teknologi untuk solusi pengembangan lanjutan', '/images/logo.png', 'https://recevdov.com', 'Technology Partner', 2);

-- Insert demo portfolio item
INSERT INTO portfolio_items (
  slug, title_en, title_id, description_en, description_id, 
  content_en, content_id, featured_image, client_name, 
  project_url, github_url, category_en, category_id, 
  category_icon, category_color, is_featured, start_date, end_date
) VALUES (
  'bajra-media-website',
  'Bajra Media Corporate Website',
  'Website Korporat Bajra Media',
  'Modern corporate website with responsive design and powerful CMS features for easy content management.',
  'Website perusahaan modern dengan design responsif dan fitur CMS yang powerful untuk mengelola konten dengan mudah.',
  '<p><strong>Bajra Media Corporate Website</strong> is a comprehensive digital platform that serves as both a company profile and dynamic content hub.</p><h3>Key Features</h3><ul><li>Responsive design across all devices</li><li>Blog CMS with rich text editor</li><li>SEO optimization</li><li>Dark mode support</li><li>Fast loading speeds (95+ PageSpeed score)</li><li>Intuitive admin dashboard</li></ul><h3>Technology Stack</h3><p>Built with Next.js 14, TypeScript, Tailwind CSS, and modern database management for optimal performance and maintainability.</p>',
  '<p><strong>Bajra Media Corporate Website</strong> adalah platform digital komprehensif yang berfungsi sebagai company profile dan pusat konten dinamis.</p><h3>Fitur Utama</h3><ul><li>Design responsif di semua perangkat</li><li>Blog CMS dengan rich text editor</li><li>Optimasi SEO</li><li>Dukungan dark mode</li><li>Kecepatan loading tinggi (95+ skor PageSpeed)</li><li>Dashboard admin yang intuitif</li></ul><h3>Technology Stack</h3><p>Dibangun dengan Next.js 14, TypeScript, Tailwind CSS, dan manajemen database modern untuk performa dan maintainability yang optimal.</p>',
  '/images/team-meeting.jpg',
  'Bajramedia',
  'https://bajramedia.com',
  'https://github.com/bajramedia',
  'Web Development',
  'Pengembangan Web',
  '🌐',
  '#3B82F6',
  TRUE,
  '2024-01-15',
  '2024-03-20'
);

-- Insert portfolio images for demo project
INSERT INTO portfolio_images (portfolio_id, image_url, alt_text, sort_order) VALUES
(1, '/images/team-meeting-alt.jpg', 'Bajra Media Website Screenshot 1', 1),
(1, '/images/team-meeting-2.jpg', 'Bajra Media Website Screenshot 2', 2),
(1, '/images/team.jpg', 'Bajra Media Website Screenshot 3', 3);

-- Insert portfolio tags for demo project
INSERT INTO portfolio_tags (portfolio_id, tag_name, tag_color) VALUES
(1, 'Next.js', '#000000'),
(1, 'TypeScript', '#3178C6'),
(1, 'Tailwind CSS', '#06B6D4'),
(1, 'MySQL', '#4479A1'),
(1, 'Vercel', '#000000');

-- Insert About Us content
INSERT INTO about_content (section_key, title_en, title_id, content_en, content_id) VALUES
('hero', 'About Bajramedia', 'Tentang Bajramedia', 'We are a creative digital agency dedicated to helping businesses grow through innovative technology solutions and cutting-edge design.', 'Kami adalah agensi digital kreatif yang berdedikasi membantu bisnis berkembang melalui solusi teknologi inovatif dan desain terdepan.'),
('background', 'Our Story', 'Cerita Kami', 'Bajramedia was founded with a vision to bridge the gap between traditional businesses and the digital world. We recognized the growing need for UMKM (Micro, Small, and Medium Enterprises) and institutions to embrace digital transformation in this modern era.', 'Bajramedia didirikan dengan visi untuk menjembatani kesenjangan antara bisnis tradisional dan dunia digital. Kami menyadari kebutuhan yang berkembang bagi UMKM dan institusi untuk merangkul transformasi digital di era modern ini.'),
('vision', 'Our Vision', 'Visi Kami', 'To be the leading digital transformation partner for businesses across Indonesia, empowering them to thrive in the digital age through innovative technology solutions and exceptional user experiences.', 'Menjadi mitra transformasi digital terdepan untuk bisnis di seluruh Indonesia, memberdayakan mereka untuk berkembang di era digital melalui solusi teknologi inovatif dan pengalaman pengguna yang luar biasa.'),
('mission', 'Our Mission', 'Misi Kami', '• Deliver cutting-edge digital solutions that drive business growth and success\\n• Foster innovation and creativity in every project we undertake\\n• Build long-lasting partnerships with our clients based on trust and excellence', '• Memberikan solusi digital terdepan yang mendorong pertumbuhan dan kesuksesan bisnis\\n• Memupuk inovasi dan kreativitas dalam setiap proyek yang kami kerjakan\\n• Membangun kemitraan jangka panjang dengan klien berdasarkan kepercayaan dan keunggulan');

-- ====================================
-- USEFUL QUERIES FOR API ENDPOINTS
-- ====================================

-- Get website settings:
-- SELECT * FROM settings LIMIT 1;

-- Get team members:
-- SELECT * FROM team_members WHERE is_active = TRUE ORDER BY sort_order ASC;

-- Get partners:
-- SELECT * FROM partners WHERE is_active = TRUE ORDER BY sort_order ASC;

-- Get published portfolio items:
-- SELECT * FROM portfolio_items WHERE is_published = TRUE ORDER BY is_featured DESC, sort_order ASC;

-- Get portfolio with images and tags:
-- SELECT 
--   p.*,
--   GROUP_CONCAT(DISTINCT CONCAT(pi.image_url, '|', pi.alt_text) ORDER BY pi.sort_order) as images,
--   GROUP_CONCAT(DISTINCT CONCAT(pt.tag_name, '|', pt.tag_color)) as tags
-- FROM portfolio_items p
-- LEFT JOIN portfolio_images pi ON p.id = pi.portfolio_id
-- LEFT JOIN portfolio_tags pt ON p.id = pt.portfolio_id
-- WHERE p.slug = ? AND p.is_published = TRUE
-- GROUP BY p.id;

-- Get featured blog posts:
-- SELECT * FROM blog_posts WHERE is_published = TRUE AND is_featured = TRUE ORDER BY published_at DESC LIMIT 3;

-- Get about content:
-- SELECT * FROM about_content WHERE is_active = TRUE ORDER BY id ASC;
