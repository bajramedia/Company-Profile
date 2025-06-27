-- ====================================
-- BAJRAMEDIA WEBSITE DATABASE QUERIES
-- ====================================
-- Use these queries to manage dynamic content without hardcoding

-- 1. SETTINGS TABLE - for website configuration
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  site_name VARCHAR(255) DEFAULT 'Bajramedia',
  site_description_en TEXT,
  site_description_id TEXT,
  contact_email VARCHAR(255) DEFAULT 'hello@bajramedia.com',
  contact_phone VARCHAR(50) DEFAULT '+6285739402436',
  contact_address_en TEXT,
  contact_address_id TEXT,
  social_instagram VARCHAR(255),
  social_linkedin VARCHAR(255),
  social_github VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (
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

-- 2. TEAM MEMBERS TABLE - for About Us team section
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
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert team members
INSERT INTO team_members (name, role_en, role_id, bio_en, bio_id, image_url, linkedin_url, github_url, instagram_url, sort_order) VALUES
('Kadek Adi Wirawan', 'CEO & Founder', 'CEO & Pendiri', 'Visionary leader with 8+ years of experience in digital transformation', 'Pemimpin visioner dengan pengalaman 8+ tahun dalam transformasi digital', '/images/team-meeting.jpg', '#', '#', '#', 1),
('Ni Made Sari Dewi', 'Chief Financial Officer', 'Bendahara', 'Financial expert ensuring sustainable growth and strategic investments', 'Ahli keuangan yang memastikan pertumbuhan berkelanjutan dan investasi strategis', '/images/team-meeting-alt.jpg', '#', NULL, '#', 2),
('I Putu Creative Designer', 'UI/UX Designer', 'Desainer UI/UX', 'Creative designer focused on user-centered design and beautiful interfaces', 'Desainer kreatif yang fokus pada desain yang berpusat pada pengguna dan antarmuka yang indah', '/images/team-meeting-2.jpg', '#', NULL, '#', 3),
('Kadek Social Media', 'Social Media Content Creator', 'Kreator Konten Media Sosial', 'Content strategist creating engaging social media campaigns', 'Strategi konten yang menciptakan kampanye media sosial yang menarik', '/images/team.jpg', NULL, NULL, '#', 4),
('I Made Frontend Dev', 'Frontend Developer', 'Frontend Developer', 'Frontend specialist building responsive and interactive web experiences', 'Spesialis frontend yang membangun pengalaman web responsif dan interaktif', '/images/team-meeting.jpg', '#', '#', NULL, 5),
('I Ketut Backend Pro', 'Backend Developer', 'Backend Developer', 'Backend architect creating robust and scalable server solutions', 'Arsitek backend yang menciptakan solusi server yang kokoh dan scalable', '/images/team-meeting-alt.jpg', '#', '#', NULL, 6);

-- 3. PORTFOLIO ITEMS TABLE - for portfolio section
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
  category_icon VARCHAR(50) DEFAULT '🎯',
  category_color VARCHAR(7) DEFAULT '#3B82F6',
  is_featured BOOLEAN DEFAULT FALSE,
  start_date DATE,
  end_date DATE,
  view_count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
  '<p>Bajra Media Corporate Website is an ambitious project we worked on to build a comprehensive digital platform. This website functions not only as a company profile, but also as a dynamic information and blog center.</p><h3>Challenge & Solution</h3><p>The client needed a website that not only looked professional, but was also easy to manage by their internal team. We developed a custom CMS that is user-friendly yet powerful.</p>',
  '<p>Bajra Media Corporate Website adalah project ambisius yang kami kerjakan untuk membangun platform digital yang komprehensif. Website ini tidak hanya berfungsi sebagai company profile, tetapi juga sebagai pusat informasi dan blog yang dinamis.</p><h3>Challenge & Solution</h3><p>Klien membutuhkan website yang tidak hanya terlihat profesional, tapi juga mudah dikelola oleh tim internal mereka. Kami mengembangkan CMS custom yang user-friendly namun powerful.</p>',
  '/images/team-meeting.jpg',
  'Bajra Media',
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

-- 4. PORTFOLIO IMAGES TABLE - for portfolio gallery
CREATE TABLE IF NOT EXISTS portfolio_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  portfolio_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  FOREIGN KEY (portfolio_id) REFERENCES portfolio_items(id) ON DELETE CASCADE
);

-- Insert demo portfolio images
INSERT INTO portfolio_images (portfolio_id, image_url, alt_text, sort_order) VALUES
(1, '/images/team-meeting-alt.jpg', 'Bajra Media Website Screenshot 1', 1),
(1, '/images/team-meeting-2.jpg', 'Bajra Media Website Screenshot 2', 2),
(1, '/images/team.jpg', 'Bajra Media Website Screenshot 3', 3);

-- 5. PORTFOLIO TAGS TABLE - for portfolio technologies
CREATE TABLE IF NOT EXISTS portfolio_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  portfolio_id INT NOT NULL,
  tag_name VARCHAR(100) NOT NULL,
  tag_color VARCHAR(7) DEFAULT '#3B82F6',
  FOREIGN KEY (portfolio_id) REFERENCES portfolio_items(id) ON DELETE CASCADE
);

-- Insert demo portfolio tags
INSERT INTO portfolio_tags (portfolio_id, tag_name, tag_color) VALUES
(1, 'Next.js', '#000000'),
(1, 'TypeScript', '#3178C6'),
(1, 'Tailwind CSS', '#06B6D4'),
(1, 'MySQL', '#4479A1'),
(1, 'Vercel', '#000000');

-- 6. BLOG POSTS TABLE - for blog section
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
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. ABOUT CONTENT TABLE - for About Us page content
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

-- Insert About Us content
INSERT INTO about_content (section_key, title_en, title_id, content_en, content_id) VALUES
('hero', 'About Bajramedia', 'Tentang Bajramedia', 'We are a creative digital agency dedicated to helping businesses grow through innovative technology solutions and cutting-edge design.', 'Kami adalah agensi digital kreatif yang berdedikasi membantu bisnis berkembang melalui solusi teknologi inovatif dan desain terdepan.'),
('background', 'Our Story', 'Cerita Kami', 'Bajramedia was founded with a vision to bridge the gap between traditional businesses and the digital world. We recognized the growing need for UMKM (Micro, Small, and Medium Enterprises) and institutions to embrace digital transformation in this modern era.', 'Bajramedia didirikan dengan visi untuk menjembatani kesenjangan antara bisnis tradisional dan dunia digital. Kami menyadari kebutuhan yang berkembang bagi UMKM dan institusi untuk merangkul transformasi digital di era modern ini.'),
('vision', 'Our Vision', 'Visi Kami', 'To be the leading digital transformation partner for businesses across Indonesia, empowering them to thrive in the digital age through innovative technology solutions and exceptional user experiences.', 'Menjadi mitra transformasi digital terdepan untuk bisnis di seluruh Indonesia, memberdayakan mereka untuk berkembang di era digital melalui solusi teknologi inovatif dan pengalaman pengguna yang luar biasa.'),
('mission', 'Our Mission', 'Misi Kami', '• Deliver cutting-edge digital solutions that drive business growth and success\n• Foster innovation and creativity in every project we undertake\n• Build long-lasting partnerships with our clients based on trust and excellence', '• Memberikan solusi digital terdepan yang mendorong pertumbuhan dan kesuksesan bisnis\n• Memupuk inovasi dan kreativitas dalam setiap proyek yang kami kerjakan\n• Membangun kemitraan jangka panjang dengan klien berdasarkan kepercayaan dan keunggulan');

-- ====================================
-- USEFUL QUERIES FOR FRONTEND
-- ====================================

-- Get website settings
-- SELECT * FROM settings LIMIT 1;

-- Get active team members ordered
-- SELECT * FROM team_members WHERE is_active = TRUE ORDER BY sort_order ASC;

-- Get active partners ordered
-- SELECT * FROM partners WHERE is_active = TRUE ORDER BY sort_order ASC;

-- Get published portfolio items
-- SELECT * FROM portfolio_items WHERE is_published = TRUE ORDER BY is_featured DESC, sort_order ASC;

-- Get portfolio item with images and tags
-- SELECT 
--   p.*,
--   GROUP_CONCAT(DISTINCT CONCAT(pi.image_url, '|', pi.alt_text) ORDER BY pi.sort_order) as images,
--   GROUP_CONCAT(DISTINCT CONCAT(pt.tag_name, '|', pt.tag_color)) as tags
-- FROM portfolio_items p
-- LEFT JOIN portfolio_images pi ON p.id = pi.portfolio_id
-- LEFT JOIN portfolio_tags pt ON p.id = pt.portfolio_id
-- WHERE p.slug = 'bajra-media-website'
-- GROUP BY p.id;

-- Get featured blog posts
-- SELECT * FROM blog_posts WHERE is_published = TRUE AND is_featured = TRUE ORDER BY published_at DESC LIMIT 3;

-- Get about content
-- SELECT * FROM about_content WHERE is_active = TRUE;

-- ====================================
-- ADMIN QUERIES FOR CONTENT MANAGEMENT
-- ====================================

-- Update website settings
-- UPDATE settings SET 
--   site_name = 'New Site Name',
--   site_description_en = 'New English description',
--   site_description_id = 'New Indonesian description'
-- WHERE id = 1;

-- Add new team member
-- INSERT INTO team_members (name, role_en, role_id, bio_en, bio_id, image_url, sort_order) 
-- VALUES ('New Member', 'New Role', 'Peran Baru', 'Bio in English', 'Bio dalam Bahasa Indonesia', '/images/new-member.jpg', 7);

-- Add new portfolio item
-- INSERT INTO portfolio_items (slug, title_en, title_id, description_en, description_id, client_name, category_en, category_id)
-- VALUES ('new-project', 'New Project', 'Proyek Baru', 'Description', 'Deskripsi', 'Client Name', 'Web Development', 'Pengembangan Web');

-- Update portfolio item
-- UPDATE portfolio_items SET 
--   title_en = 'Updated Title',
--   description_en = 'Updated description'
-- WHERE slug = 'project-slug';

-- ====================================
-- NOTES FOR IMPLEMENTATION
-- ====================================
-- 1. Replace hardcoded data in components with API calls to these tables
-- 2. Create API endpoints to fetch data from these tables
-- 3. Add admin interface to manage content in these tables
-- 4. Use environment variables for database connection
-- 5. Add proper validation and sanitization for user inputs
-- 6. Consider adding caching for better performance
-- 7. Add image upload functionality for team members, portfolio, etc.
-- 8. Implement search functionality for blog posts and portfolio 