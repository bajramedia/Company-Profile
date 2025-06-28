-- =====================================================
-- ADD 10 NEW TECHNOLOGIES TO DATABASE
-- Run this in your phpMyAdmin or database console
-- =====================================================

INSERT INTO technologies (name, icon, description_en, description_id, category, color, sort_order, is_active) VALUES

-- Web Development Technologies
('Laravel', '🔴', 'PHP framework for web artisans with elegant syntax', 'Framework PHP untuk pengembang web dengan sintaks yang elegan', 'web-design', '#FF2D20', 13, 1),

('Vue.js', '💚', 'Progressive JavaScript framework for building UIs', 'Framework JavaScript progresif untuk membangun antarmuka pengguna', 'web-design', '#4FC08D', 14, 1),

('Docker', '🐳', 'Platform for developing, shipping, and running applications', 'Platform untuk mengembangkan, mengirim, dan menjalankan aplikasi', 'technology', '#2496ED', 15, 1),

-- Mobile Development Technologies  
('Kotlin', '🟣', 'Modern programming language for Android development', 'Bahasa pemrograman modern untuk pengembangan Android', 'mobile-design', '#7F52FF', 16, 1),

('Swift', '🧡', 'Powerful programming language for iOS app development', 'Bahasa pemrograman yang powerful untuk pengembangan aplikasi iOS', 'mobile-design', '#FA7343', 17, 1),

-- Design & UI/UX Tools
('Sketch', '💎', 'Digital design toolkit for creating user interfaces', 'Toolkit desain digital untuk membuat antarmuka pengguna', 'web-design', '#F7B500', 18, 1),

('Framer', '🎨', 'Interactive design tool for creating prototypes', 'Tool desain interaktif untuk membuat prototipe', 'web-design', '#0055FF', 19, 1),

-- DevOps & Tools
('AWS', '☁️', 'Amazon Web Services cloud computing platform', 'Platform cloud computing Amazon Web Services', 'technology', '#FF9900', 20, 1),

('Git', '📝', 'Distributed version control system for tracking changes', 'Sistem kontrol versi terdistribusi untuk melacak perubahan', 'technology', '#F05032', 21, 1),

-- Database Technology
('PostgreSQL', '🐘', 'Advanced open source relational database', 'Database relasional open source yang canggih', 'technology', '#336791', 22, 1);

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check if data was inserted successfully
SELECT 'NEW TECHNOLOGIES ADDED:' as Status;
SELECT id, name, icon, category, color, is_active, created_at 
FROM technologies 
WHERE sort_order >= 13 
ORDER BY sort_order ASC;

-- Show total count
SELECT 'TOTAL TECHNOLOGIES:' as Info, COUNT(*) as Total FROM technologies WHERE is_active = 1;

-- Show by category
SELECT 'TECHNOLOGIES BY CATEGORY:' as Info;
SELECT category, COUNT(*) as count 
FROM technologies 
WHERE is_active = 1 
GROUP BY category 
ORDER BY count DESC; 