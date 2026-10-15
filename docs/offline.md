# Offline

- Service worker aktif pada production build. Buka aplikasi dan halaman bacaan sekali saat online agar halaman serta asetnya tersimpan. Halaman yang belum dikunjungi masih membutuhkan koneksi.
- Dua belas latar poster WebP diprecache bersama aset statis, masing-masing di bawah 2 MiB; total anggaran latar 4 MiB. Poster memakai URL aset asli agar pilihan latar tidak bergantung pada cache transformasi gambar Next.
- API jadwal dan lokasi menggunakan jaringan tanpa fallback service worker. Jadwal memiliki cache aplikasi tervalidasi: maksimal 12 respons, terpisah menurut lokasi, metode dan tanggal. Jika permintaan gagal, data tersimpan diberi tanggal dan penanda; data lama tidak digunakan untuk countdown hari ini.
- Pencarian lokasi dan jadwal yang belum tersimpan memerlukan koneksi. Tersambung kembali memperbarui query, tanpa me-reload halaman.
- Progres, favorit dan pengaturan berada di penyimpanan browser. Menghapus data situs juga menghapus data tersebut. Jika penyimpanan diblokir, aplikasi tetap bisa dipakai selama sesi berjalan.

Verifikasi dengan production build (`pnpm build`, `pnpm start`), kunjungi halaman, tunggu service worker aktif, lalu gunakan mode offline pada browser. Mode development memakai kebijakan jaringan berbeda.
