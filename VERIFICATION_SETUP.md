# 🔍 Website Verification Setup Guide

## Overview

Website verification codes diperlukan untuk memverifikasi ownership website di berbagai search engines. Ini adalah langkah crucial untuk SEO dan website analytics.

## 🌐 1. GOOGLE SEARCH CONSOLE VERIFICATION

### Steps:

1. **Buka Google Search Console**

   - URL: https://search.google.com/search-console
   - Login dengan Google account

2. **Add Property**

   - Klik "+ Add Property"
   - Pilih "URL prefix"
   - Masukkan: `https://bajramedia.com`
   - Klik "Continue"

3. **Verification Method**
   - Pilih "HTML tag" method
   - Copy meta tag: `<meta name="google-site-verification" content="ABC123..." />`
   - Ambil value dari content attribute (ABC123...)

### Environment Variable:

```bash
GOOGLE_VERIFICATION_CODE=ABC123XYZ...
```

---

## 🔍 2. YANDEX WEBMASTER VERIFICATION

### Steps:

1. **Buka Yandex Webmaster**

   - URL: https://webmaster.yandex.com
   - Login dengan Yandex account (create if needed)

2. **Add Site**

   - Klik "Add site"
   - Masukkan: `https://bajramedia.com`
   - Klik "Add"

3. **Verification**
   - Pilih "Meta tag" method
   - Copy meta tag: `<meta name="yandex-verification" content="DEF456..." />`
   - Ambil value dari content attribute (DEF456...)

### Environment Variable:

```bash
YANDEX_VERIFICATION_CODE=DEF456ABC...
```

---

## 🔍 3. BING/YAHOO WEBMASTER VERIFICATION

### Steps:

1. **Buka Bing Webmaster Tools**

   - URL: https://www.bing.com/webmasters
   - Login dengan Microsoft account

2. **Add Site**

   - Klik "Add a site"
   - Masukkan: `https://bajramedia.com`
   - Klik "Add"

3. **Verification**
   - Pilih "Add meta tag to your site"
   - Copy meta tag: `<meta name="msvalidate.01" content="GHI789..." />`
   - Ambil value dari content attribute (GHI789...)

### Environment Variable:

```bash
YAHOO_VERIFICATION_CODE=GHI789DEF...
```

---

## 🛠️ IMPLEMENTATION

### Method 1: Environment Variables (Recommended)

Add to your hosting platform (Vercel/Netlify):

```bash
GOOGLE_VERIFICATION_CODE=your-actual-google-code
YANDEX_VERIFICATION_CODE=your-actual-yandex-code
YAHOO_VERIFICATION_CODE=your-actual-yahoo-code
```

### Method 2: Direct Code Update

Update `src/app/layout.tsx`:

```typescript
verification: {
  google: "your-actual-google-code",
  yandex: "your-actual-yandex-code",
  yahoo: "your-actual-yahoo-code"
},
```

---

## 📊 BENEFITS SETELAH VERIFICATION

### Google Search Console:

- ✅ Monitor search performance
- ✅ Submit sitemaps
- ✅ Check indexing status
- ✅ See search queries
- ✅ Monitor Core Web Vitals

### Yandex Webmaster:

- ✅ Monitor Russian/CIS market performance
- ✅ Submit sitemaps to Yandex
- ✅ Check indexing in Yandex search

### Bing Webmaster:

- ✅ Monitor Bing & Yahoo search performance
- ✅ Submit sitemaps
- ✅ SEO recommendations
- ✅ Keyword research tools

---

## 🚀 NEXT STEPS AFTER VERIFICATION

1. **Submit Sitemaps** ke semua search engines
2. **Setup Google Analytics 4** untuk detailed tracking
3. **Monitor performance** weekly via dashboards
4. **Check indexing status** dan troubleshoot issues
5. **Use insights** untuk improve SEO strategy

---

## 📧 SUPPORT

Jika ada masalah dengan verification process, contact:

- Email: admin.bajra@bajramedia.com
- Documentation: This guide
- Search Console Help: https://support.google.com/webmasters
