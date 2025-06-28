-- =====================================================
-- CLEANUP DUMMY DATA SCRIPT
-- Script untuk menghapus data dummy dari database
-- =====================================================

-- Backup existing data before cleanup (optional)
-- CREATE TABLE partners_backup AS SELECT * FROM partners;
-- CREATE TABLE team_members_backup AS SELECT * FROM team_members;

-- Hapus data dummy partners
-- Pastikan untuk mengganti dengan nama partner yang benar-benar dummy
DELETE FROM partners WHERE name_en IN (
    'Primakara University', 
    'Recevdov'
);

-- Hapus data dummy team members
-- Pastikan untuk mengganti dengan nama yang benar-benar dummy
DELETE FROM team_members WHERE name IN (
    'Muhammad Bajra',
    'Sarah Chen', 
    'Alex Rodriguez',
    'Priya Sharma',
    'David Kim',
    'Lisa Wang'
);

-- Reset auto increment untuk clean start (optional)
-- ALTER TABLE partners AUTO_INCREMENT = 1;
-- ALTER TABLE team_members AUTO_INCREMENT = 1;

-- Verify cleanup
SELECT 'Partners Count After Cleanup:' as Info, COUNT(*) as Count FROM partners;
SELECT 'Team Members Count After Cleanup:' as Info, COUNT(*) as Count FROM team_members;

-- Show remaining data
SELECT 'REMAINING PARTNERS:' as Section;
SELECT id, name_en, name_id, created_at FROM partners ORDER BY id;

SELECT 'REMAINING TEAM MEMBERS:' as Section;  
SELECT id, name, role_en, created_at FROM team_members ORDER BY id;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT '✅ DUMMY DATA CLEANUP COMPLETE!' as Status, 
       'Database is now ready for real data through admin panel.' as Message; 