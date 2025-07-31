
-- Menambahkan tabel baru untuk seksi-seksi post blog
-- Tabel ini akan menyimpan konten per-seksi, memungkinkan struktur artikel yang lebih modular.
CREATE TABLE IF NOT EXISTS `post_sections` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `post_id` INT(11) NOT NULL,
  `title` VARCHAR(255) NULL,
  `summary` TEXT NULL,
  `content` TEXT NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `sort_order` INT(11) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Menghapus kolom 'content' dari tabel 'post' yang sudah ada
-- Kolom ini tidak lagi diperlukan karena konten akan disimpan di 'post_sections'.
-- Catatan: Pastikan kamu sudah mem-backup data dari kolom ini jika diperlukan sebelum menjalankan perintah ini.
ALTER TABLE `post` DROP COLUMN `content`;

-- Menambahkan FOREIGN KEY untuk menghubungkan post_sections dengan post
-- Ini memastikan bahwa setiap seksi terhubung ke sebuah post yang valid.
ALTER TABLE `post_sections`
ADD CONSTRAINT `fk_post_id`
FOREIGN KEY (`post_id`) REFERENCES `post`(`id`)
ON DELETE CASCADE;

SELECT '✅ Perubahan skema database untuk post section berhasil diterapkan!' as Status; 