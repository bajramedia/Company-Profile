# 📊 DATABASE INSTALLATION GUIDE - BAJRAMEDIA

## 🎯 **Quick Setup (Recommended)**

### **Step 1: Download File**
1. Download file: `database-schema-safe.sql`
2. Save ke komputer kamu

### **Step 2: Open phpMyAdmin**
1. Buka: `https://galaggara.ixcp.rumahweb.net:2083/cpsess5785558216/3rdparty/phpMyAdmin/`
2. Login dengan credentials hosting
3. Pilih database: `bajx7634_bajra`

### **Step 3: Import SQL File**
1. Klik tab **"Import"** di phpMyAdmin
2. Klik **"Choose File"** dan pilih `database-schema-safe.sql`
3. Klik **"Go"** untuk execute
4. ✅ **Success!** - Data akan ter-install otomatis

---

## 🔧 **Alternative Method (Copy-Paste)**

### **Option A: Execute via SQL Tab**
1. Klik tab **"SQL"** di phpMyAdmin
2. Copy-paste **SELURUH ISI** file `database-schema-safe.sql`
3. Klik **"Go"** untuk execute

### **Option B: Execute Step by Step**
Jika ada error, jalankan per section:

```sql
-- 1. CREATE TABLES (jalankan satu per satu)
CREATE TABLE IF NOT EXISTS about_content (...);
CREATE TABLE IF NOT EXISTS team_members (...);
CREATE TABLE IF NOT EXISTS partners (...);
```

```sql
-- 2. INSERT DATA (jalankan satu per satu)
INSERT IGNORE INTO about_content (...);
INSERT IGNORE INTO team_members (...);
INSERT IGNORE INTO partners (...);
```

---

## ✅ **Verification - Cek Hasil**

### **Check Tables Created:**
```sql
SHOW TABLES LIKE '%about%';
SHOW TABLES LIKE '%team%';
SHOW TABLES LIKE '%partner%';
```

### **Check Data Inserted:**
```sql
SELECT COUNT(*) FROM about_content;
SELECT COUNT(*) FROM team_members;
SELECT COUNT(*) FROM partners;
```

### **Preview Data:**
```sql
SELECT * FROM about_content;
SELECT * FROM team_members LIMIT 3;
SELECT * FROM partners;
```

---

## 🚨 **Troubleshooting Common Errors**

### **Error: "Table already exists"**
✅ **FIXED!** Script ini menggunakan `IF NOT EXISTS` - aman dijalankan berulang kali.

### **Error: "Duplicate entry"**
✅ **FIXED!** Script ini menggunakan `INSERT IGNORE` - tidak akan duplikasi data.

### **Error: "Column doesn't exist"**
```sql
-- Check table structure:
DESCRIBE about_content;
DESCRIBE team_members;
```

### **Error: "Access denied"**
- Pastikan login dengan user yang punya permission CREATE dan INSERT
- Contact hosting support jika masih error

---

## 🎯 **Next Steps After Installation**

### **1. Test Admin Panel:**
1. Buka: `http://localhost:3000/admin/about`
2. Login dengan admin credentials
3. Test create/edit/delete functions

### **2. Test Frontend:**
1. Buka: `http://localhost:3000/about`
2. Pastikan data team dan partners muncul
3. Check footer content

### **3. Commit Changes:**
```bash
git add database-schema-safe.sql
git commit -m "Add safe database installation script"
git push origin main
```

---

## 📋 **What's Included in This Setup**

### **🔧 Tables Created:**
- ✅ `about_content` - Background, Vision, Mission
- ✅ `team_members` - 6 team members dengan bio
- ✅ `partners` - Primakara University, Recevdov  
- ✅ `footer_content` - Footer links dan content
- ✅ `settings` - Website settings & social media

### **📝 Sample Data:**
- ✅ **3 About sections** (background, vision, mission)
- ✅ **6 Team members** dengan roles dan social links
- ✅ **2 Partners** dengan logos dan descriptions
- ✅ **3 Footer sections** untuk navigation
- ✅ **Website settings** dengan contact info

### **🛡️ Safety Features:**
- ✅ `CREATE TABLE IF NOT EXISTS` - tidak error jika table sudah ada
- ✅ `INSERT IGNORE` - tidak duplikasi data
- ✅ `ON DUPLICATE KEY UPDATE` - update jika data sudah ada
- ✅ Verification queries - cek hasil installation
- ✅ Cleanup queries - reset data jika perlu

---

## 🎉 **Success Indicators**

After running the script, you should see:
```
✅ About Content Count: 3
✅ Team Members Count: 6  
✅ Partners Count: 2
✅ Footer Content Count: 3
✅ Settings Count: 1
✅ DATABASE SETUP COMPLETE!
```

**Ready to test your admin panel! 🚀** 