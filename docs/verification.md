# Hasil verifikasi perubahan aplikasi

Pemeriksaan terakhir dilakukan pada 19 Oktober 2026, melanjutkan verifikasi 13–18 Oktober. Seluruh tugas T1–T23 pada [spesifikasi](SPEC.md) selesai di workspace ini. Audio bacaan dan versioning tetap untuk fase berikutnya.

## Pemeriksaan otomatis

| Pemeriksaan                          | Hasil                                                             |
| ------------------------------------ | ----------------------------------------------------------------- |
| `pnpm test`                          | 67 tes lulus pada 19 Oktober                                      |
| `pnpm check`                         | Lulus                                                             |
| `pnpm check:types`                   | Lulus                                                             |
| `eslint src`                         | Lulus                                                             |
| `prettier --check src scripts tests` | Lulus                                                             |
| `git diff --check`                   | Lulus                                                             |
| `pnpm build --webpack`               | Build production lulus; 73 entri precache, 3158,08 KiB (3,08 MiB) |
| `pnpm test:browser`                  | 17 kelompok regresi Chrome lulus pada 19 Oktober                  |
| `testConsistency` (browser)          | 4 kelompok lulus dalam suite lengkap pada 19 Oktober              |
| Audit aturan SonarJS/async/JSX terkait | 25 berkas diperiksa; 0 error pada 19 Oktober                    |

Perbaikan static analysis diverifikasi dengan ESLint dan SonarJS 4.2.2 dari direktori sementara, tanpa menambah dependency proyek. Cognitive Complexity task Nominatim turun dari 16 menjadi 12 setelah pemeliharaan cache diekstrak. Aturan terkait nested conditional/template, optional type, ekspresi identik, reverse, Promise, await, context provider, children props, key FieldError, serta semantik aksesibilitas lulus. Ini pemeriksaan aturan lokal terkait temuan, bukan hasil pemindaian proyek pada layanan SonarQube.

Lima modul browser kini memakai `@ts-check`, tipe konteks bersama dan anotasi JSDoc untuk fixture dinamis. Memasukkannya ke `tsconfig.json` terlebih dahulu menghasilkan 34 error; setelah perbaikan, `pnpm check` lulus. Callback UI menandai operasi store async dengan `void`, sementara bunyi klik tetap dijalankan dalam gesture pengguna. Cache jadwal tetap sinkron dan tidak lagi memakai await. Komentar bahasa Inggris menjelaskan lock store, deduplikasi, limiter, validasi, cooldown dan masa berlaku cache.

Suite lengkap mempertahankan seluruh 67 tes unit dan 17 kelompok browser. Pemeriksaan tambahan pada 390 dan 1024 piksel memastikan Label ikon native memfokuskan input, carousel berbentuk section dengan slide bernama, panah keyboard menggulir, dan tombol latar memperbarui pilihan tanpa overflow horizontal. Fixture tambahan menunggu font/layout siap sebelum klik. Screenshot lokasi dan poster serta review terpisah tidak menemukan regresi; Safari/iOS fisik belum diperiksa.

Tes unit mencakup placeholder SSR, jam perangkat dan resume tab, pergantian tanggal/zona waktu, jadwal besok setelah Isya, cache terpisah per lokasi/tanggal, pembatalan request, penulisan cache bersamaan, pemulihan audio, migrasi pengaturan, progres/reset/undo, pencarian, target bacaan, aset offline, dan MIME/fallback ekspor.

Tes browser memeriksa progres setelah reload dan offline, reconnect tanpa reload dokumen, favorit, pencarian, tautan langsung, tata letak poster mobile, label kontrol, tombol Escape pada pengaturan poster, byte JPEG, serta unduhan setelah native share ditolak. Tes menunggu pemasangan service worker pertama selesai sebelum reload dan mencatat status worker saat gagal.

Pada 17 Oktober, tes dua tab menahan Web Lock untuk mengantre perubahan dari kedua dokumen: dua favorit tetap tersimpan, empat increment berhenti pada target tiga, reset diperbarui di tab lain, increment baru membatalkan undo sesi lama, dan pengaturan/penghapusan storage ikut tersinkron. Tes unit juga memeriksa pembaruan dari snapshot lama dan pemisahan sesi.

Penolakan baca/tulis/hapus storage diuji dengan adapter terkendali. Di browser, kegagalan tulis mempertahankan progres/favorit saat fokus atau pageshow, menghasilkan satu toast peringatan, dan menampilkan status sementara di sesi/pengaturan. Setelah storage dapat ditulis lagi, data sementara tidak otomatis menimpa data permanen. JSON terpotong tidak membuat tombol terus nonaktif; mutasi berikutnya menulis data valid. Fixture pemasangan dimulai dari dokumen baru tanpa cache dismissal, sedangkan fixture progres menunda prompt pemasangan agar tidak menutupi tombol. Observer toast memeriksa elemen yang ditambahkan beserta turunannya.

Urutan bacaan diuji untuk semua kategori dan mencakup doa tanpa repetisi; ID favorit, anchor, tautan, dan ID progres pagi/petang tetap kompatibel. Alert dan Empty berasal dari shadcn sesuai preset proyek dan memakai utilitas gaya bersama.

Komponen error halaman/global dirender tanpa provider aplikasi. Fixture browser dengan root yang melempar error memeriksa bahasa dokumen, judul error global, tautan beranda, lebar mobile 320 piksel, dan tombol Coba lagi yang memulihkan tampilan. Props `retry` dan dokumen global mengikuti panduan Next 16.3 yang terpasang; build production berhasil mengintegrasikannya.

Workflow [Checks](../.github/workflows/check.yml) telah dikonfigurasi untuk frozen install, generasi tipe Next, pemeriksaan tanpa perubahan sumber, tes unit, build Webpack, dan regresi browser dengan cleanup server. Perintah lokal lulus; workflow belum dijalankan di GitHub. `pnpm fix`, `lint:fix`, `format:fix`, dan `update:packages` memisahkan operasi yang mengubah berkas dari pemeriksaan.

Pada 16 Oktober, tes server lokasi mencakup validasi parameter, deduplikasi request bersamaan, cache/masa berlaku, limiter bersama search/reverse, serta cooldown penyedia. Tes SSR memastikan tautan sesi tidak aktif sebelum progres tersimpan selesai dimuat.

Empat tes konfigurasi memeriksa URL privat eksplisit, penolakan variabel yang hilang meskipun nama lama tersedia, penolakan nilai kosong/URL tidak valid, dan pembatasan akses variabel penyedia melalui `env` di browser. Kedua proxy memakai `src/env.ts` tanpa fallback; `.env.local` memakai nama privat dengan nilai sebelumnya tetap dipertahankan.

Lokasi, pencarian bacaan, pengaturan, dan kontrol poster memakai Field resmi shadcn sesuai preset Radix tanpa form library atau dependency baru. Suite browser lulus setelah selector retry diperbarui dari struktur wrapper menjadi nama aksesibel tombol. Pemeriksaan tambahan pada viewport 320 × 740 memastikan FieldLabel mengaktifkan switch, slider mendukung keyboard, pengaturan bertahan setelah reload, dan kontrol tidak melebar keluar sheet. Area konten pengaturan digulir sebelum mengeklik kontrol di bagian bawah.

Pemilih lokasi kini memakai Combobox resmi shadcn dengan Base UI, sesuai pilihan pengguna setelah mencoba Item/Popover. Input tetap memakai InputGroup dan Field; hasil berupa listbox/options bawaan combobox. Regresi memeriksa nama aksesibel, relasi `aria-controls`, `aria-expanded`, dan `aria-activedescendant`: panah menyorot opsi sementara fokus tetap di input, Enter atau pointer memilih, lalu label kota dipertahankan saat disimpan dan dibuka kembali. Pencarian tetap manual melalui Cari/Enter; mengetik, fokus, reconnect, memilih, dan membuka ulang hasil tidak mengirim request baru. Escape menutup hasil terlebih dahulu, kemudian dialog/drawer Radix. Konten keutamaan, filter bacaan, serta penolakan storage/pemasangan tetap tercakup dalam suite konsistensi.

Pada 18 Oktober, regresi semantik daftar tindakan gagal pada build ToggleGroup sebelumnya dan lulus setelah beralih ke Item. Empat kelompok `testConsistency` dijalankan ulang pada build production terbaru. Pemeriksaan visual pada viewport 1024 dan 390 piksel menunjukkan baris hasil, hover, ring fokus, serta atribusi terbaca; lebar area form dan lebar kontennya sama (408/408 dan 358/358 piksel), tanpa scrollbar horizontal. Lint, format, tipe, dan build juga lulus; suite unit dan browser lengkap tidak diulang untuk perubahan komposisi ini.

Regresi lokasi juga mengukur `scrollWidth` pada InputGroup dan area form: tes gagal pada build lama yang meluber 3 piksel, lalu lulus setelah margin negatif addon diganti padding setara. Posisi input/tombol tetap sama dan area scroll menyediakan ruang untuk ring fokus. Pada mobile 390 piksel dan desktop 1024 piksel, atribusi tertaut tampil hanya di bawah daftar pencarian atau kota yang baru dideteksi lewat geolokasi. Pilihan hasil pencarian dan pembukaan kembali kota tersimpan tidak mengulang atribusi. Sumber pilihan (`saved`, `search`, `geolocation`) hanya disimpan dalam state dialog, tanpa mengubah cookie lokasi. Fixture reverse geocoding memakai Bandung tanpa mengakses geocoder publik; tes memastikan kota hasil deteksi dapat disimpan dan dibuka kembali tanpa atribusi. Empat kelompok regresi konsistensi lulus setelah penyederhanaan ini. Pemeriksaan setelah tombol hapus menunggu nilai input selesai diperbarui sebelum mengecek hilangnya atribusi.

Implementasi Item/Popover sebelumnya diverifikasi dengan tes geometri yang gagal pada build inline: satu hasil menaikkan tinggi drawer dari 331,25 menjadi 405,25 piksel dan menggeser input 74 piksel. Pada build Item/Popover tersebut, tinggi dialog/drawer tetap 416 piksel pada viewport 390 × 844 dan 1024 × 844, termasuk ketika mencari, loading, error, retry, kosong, memilih kota, serta geolokasi loading/ditolak/berhasil. Daftar memakai portal dengan lebar mengikuti input; enam hasil menggulir di ScrollArea, sementara atribusi tetap terlihat. Panah bawah membuka ulang hasil yang ditutup tanpa request baru, End menggulir hingga hasil terakhir, dan klik di luar popup tidak menutup parent. Tes atribusi menunggu animasi penutupan popup selesai setelah pilihan.

Empat kelompok `testConsistency` lulus pada build Item/Popover. Pemeriksaan visual tambahan mencakup desktop, mobile, dan viewport pendek 320 × 480: drawer menjadi 384 piksel, popup menyesuaikan ruang menjadi sekitar 205 piksel, hasil tetap dapat digulir, dan tidak ada overflow horizontal. Lint, format, tipe, dan build production lulus. Suite unit dan browser lengkap tidak diulang untuk perubahan popup ini; keyboard virtual pada perangkat fisik belum diuji.

Setelah kembali ke combobox, `pnpm check`, build production, dan empat kelompok `testConsistency` lulus lagi. Popup ditempatkan di dalam container dialog agar tetap berada dalam pengelolaan fokus Radix; wrapper portal memakai `display: contents` agar tidak menambah baris grid atau menggeser tombol Simpan. Penanganan Escape pada parent menutup combobox lebih dahulu. Atribusi tetap di luar area gulir opsi, hanya pada hasil pencarian atau geolokasi baru. Screenshot desktop 1024 × 844, mobile 390 × 844, dan viewport pendek 320 × 480 menunjukkan popup muat tanpa overflow horizontal; popup enam hasil sekitar 220 piksel dengan area daftar 192 piksel pada layar normal. Komponen UI lain tidak ditimpa saat memasang combobox. Suite unit dan browser lengkap tidak diulang; keyboard virtual perangkat fisik belum diuji.

Pembersihan berikutnya menghapus tinggi tetap modal, peregangan/scroll pada wrapper form, dan `mt-auto` tombol geolokasi. Dialog/drawer kini mengikuti konten: pada keadaan pencarian, tinggi sekitar 279 piksel di desktop dan 309 piksel di mobile. Perubahan pilihan atau pesan boleh mengubah tinggi; membuka, menutup, dan membuka ulang popup tidak menggeser input maupun tombol Simpan. Tes geometri menemukan pergeseran 4 piksel akibat margin `FieldDescription` ketika output pembaca layar ditambahkan; memindahkan output sebelum deskripsi memperbaikinya. `pnpm check`, build production, dan empat kelompok konsistensi lulus, dengan seluruh alur lokasi diperiksa pada 320 × 480, 390 × 844, serta 1024 × 844. Screenshot memverifikasi daftar enam opsi menggulir sendiri dan atribusi tetap terlihat pada ketiga ukuran tersebut.

Pengaturan memakai ScrollArea shadcn dengan thumb warna primary dan auto-hide. Pemeriksaan terfokus pada viewport 320 dan 1024 piksel membuktikan PageDown menggulir konten, thumb berubah antara tema terang/gelap dan menghilang ketika berhenti, serta header/footer tidak keluar layar. Audit AST memeriksa 144 deklarasi props komponen menggunakan `NamaComponentProps = Readonly<...>`; perbandingan hasil transpile memastikan refactor tipe tidak mengubah JavaScript dari 62 berkas TSX yang tidak mendapat perubahan perilaku.

Respons geocoder dalam tes interaksi menggunakan fixture, bukan layanan publik. Batas server diuji dengan fetch dan waktu terkontrol; pengujian ini tidak membuktikan koordinasi antar-instance production.

Proxy Aladhan diuji untuk tanggal kalender dan parameter tidak valid, normalisasi URL penyedia, isolasi cache antar lokasi/tanggal/metode/penyesuaian, deduplikasi, pembatalan satu pemanggil, kedaluwarsa dan kapasitas cache, respons rusak, timeout, batas trafik bersama, serta `Retry-After` berbentuk detik/tanggal HTTP. Tes klien memastikan waktu pengambilan asli tetap tersimpan saat fallback offline.

Regresi browser jadwal memakai fixture bertanggal, memeriksa request ke `/api/prayer-times`, reload offline, peringatan jadwal lama, countdown yang tidak memakai data lama, penolakan salinan API di cache service worker, dan pembaruan saat tersambung kembali. Tes ini menemukan status awal TanStack Query yang masih online setelah reload offline; provider kini menyinkronkan status awal dengan browser. Skenario yang sama dan seluruh suite telah lulus setelah perbaikan. Pemeriksaan terpisah terhadap layanan Aladhan sebenarnya melalui endpoint lokal menghasilkan HTTP 200 untuk Bogor pada 16 Oktober 2026, zona Asia/Jakarta, waktu pengambilan yang sama pada cache hit, dan HTTP 400 untuk tanggal 30 Februari.

Pada 14 Oktober, setup browser diperbaiki setelah ditemukan ketergantungan pada executable di cache agen. `agent-browser` sekarang merupakan dev dependency terkunci. `pnpm install --frozen-lockfile`, `pnpm test:browser:install`, dan `pnpm test:browser` telah lulus tanpa `AGENT_BROWSER_BIN` atau `CHROME_BIN`. Dua regresi tambahan memeriksa pesan untuk CLI yang hilang dan server yang belum aktif, tanpa mencoba cleanup sesi yang belum dimulai.

Build Turbopack bawaan belum dapat diverifikasi dalam sandbox ini: subprocess pemrosesan CSS gagal membuka port dengan `Operation not permitted`. Build Webpack menjadi verifikasi production alternatif. Webpack menghasilkan peringatan dependency dinamis Browserslist melalui Serwist, tetapi selesai dengan exit code 0.

## Pemeriksaan browser tambahan

- Jam beranda mengikuti jam perangkat Asia/Jakarta, termasuk detiknya. Countdown setelah Isya mengambil Subuh dari jadwal tanggal berikutnya.
- Memajukan tanggal dua hari ketika offline menampilkan peringatan jadwal lama dan menyembunyikan countdown dari data tersebut.
- Seluruh 12 latar poster ditemukan dalam cache browser. Ukuran total turun dari 26.319.938 menjadi 1.255.452 byte, berkurang sekitar 95,2%.
- Tiga klik berturut-turut menghasilkan tiga oscillator audio dengan sinyal terukur. Skenario context suspended/interrupted/closed dan resume ditolak dicakup tes unit.
- Request pencarian lokasi lama dibatalkan ketika input berganti; hasil terbaru tetap ditampilkan. Respons gagal menampilkan tindakan coba lagi.
- Toggle penghitung mempertahankan progres; ukuran teks Arab dan terjemahan tersimpan secara terpisah.
- `/doa/pagi` menghasilkan HTTP 404. Tautan bacaan membuka dan menggulir ke bacaan yang dituju.
- Kontrol poster dapat dijangkau pada viewport mobile 320 × 740 dan 390 × 844; teks preview tidak dipotong oleh flex shrinking.
- Audit axe dengan tag `wcag2a,wcag2aa` pada beranda dan pengaturan poster di Chrome tidak menghasilkan pelanggaran otomatis setelah perbaikan kontras dan semantik popover. Masih ada pemeriksaan yang ditandai perlu penilaian manual; hasil ini bukan sertifikasi aksesibilitas seluruh aplikasi.

## Batas pemeriksaan

Pengujian browser menggunakan Chrome lokal dengan profil terisolasi. Safari/iOS fisik dan alur native share ke aplikasi lain belum diuji. Transliterasi telah dilengkapi dan diperiksa terhadap teks Arab yang tersedia, tetapi belum mendapat tinjauan pelafalan oleh pengajar; lihat [catatan konten](content.md).

Fixture error memakai boundary dan callback retry milik tes; pengujian ini membuktikan komponen serta interaksinya, bukan kegagalan root layout dan refetch melalui router Next yang sebenarnya. Browser tanpa Web Locks hanya mendapat antrean dalam satu tab; penulisan bersamaan antar-tab pada fallback tersebut tidak dijamin. Storage sementara hanya berlaku selama halaman terbuka dan tidak disinkronkan antar-tab.

Offline memerlukan kunjungan awal saat online. Progres, favorit, dan pengaturan tersimpan di perangkat, tanpa sinkronisasi akun; lihat [kebijakan offline](offline.md).

Cache dan limiter Nominatim serta Aladhan saat ini berlaku per proses. Deployment dengan beberapa instance/serverless perlu koordinasi bersama sesuai batas penyedia; khusus Aladhan, perhatikan instance yang berbagi IP keluar. Konfigurasi dijelaskan di [README](../README.md).
