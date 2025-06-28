// Admin translation keys that were missing
export const adminTranslations = {
  // Admin actions
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
  
  // Status types
  "admin.active": { en: "Active", id: "Aktif" },
  "admin.inactive": { en: "Inactive", id: "Tidak Aktif" },
  "admin.published": { en: "Published", id: "Dipublikasi" },
  "admin.draft": { en: "Draft", id: "Draft" },
  
  // Form fields
  "admin.name": { en: "Name", id: "Nama" },
  "admin.title": { en: "Title", id: "Judul" },
  "admin.description": { en: "Description", id: "Deskripsi" },
  "admin.image": { en: "Image", id: "Gambar" },
  "admin.date": { en: "Date", id: "Tanggal" },
  "admin.author": { en: "Author", id: "Penulis" },
  "admin.category": { en: "Category", id: "Kategori" },
  "admin.tag": { en: "Tag", id: "Tag" },
  "admin.views": { en: "Views", id: "Tampilan" },
  
  // Messages
  "admin.noDataFound": { en: "No data found", id: "Tidak ada data" },
  "admin.loadingError": { en: "Error loading data", id: "Error memuat data" },
  "admin.tryAgain": { en: "Try again", id: "Coba lagi" },
  "admin.confirmDelete": { en: "Are you sure you want to delete this item?", id: "Apakah Anda yakin ingin menghapus item ini?" },
  "admin.deleteSuccess": { en: "Item deleted successfully", id: "Item berhasil dihapus" },
  "admin.saveSuccess": { en: "Item saved successfully", id: "Item berhasil disimpan" },
  "admin.updateSuccess": { en: "Item updated successfully", id: "Item berhasil diperbarui" },
  "admin.createSuccess": { en: "Item created successfully", id: "Item berhasil dibuat" },
  
  // Tags Management
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
  
  // Authors Management
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
};

// Helper function to get translation
export function getAdminTranslation(key: string, language: 'en' | 'id' = 'en'): string {
  const translation = adminTranslations[key as keyof typeof adminTranslations];
  if (!translation) {
    console.warn(`Admin translation key "${key}" not found`);
    return key;
  }
  return translation[language] || translation.en || key;
} 
