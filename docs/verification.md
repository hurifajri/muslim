# Hasil verifikasi perubahan aplikasi

Pemeriksaan dilakukan pada 13–14 Oktober 2026. Seluruh tugas T1–T9 pada [spesifikasi](../SPEC.md) selesai di workspace ini.

## Pemeriksaan otomatis

| Pemeriksaan                                       | Hasil                                                         |
| ------------------------------------------------- | ------------------------------------------------------------- |
| `node scripts/test.mjs`                           | 29 tes lulus                                                  |
| `tsc --noEmit --pretty false --incremental false` | Lulus                                                         |
| `eslint src`                                      | Lulus                                                         |
| `prettier --check src scripts tests`              | Lulus                                                         |
| `git diff --check`                                | Lulus                                                         |
| `next build --webpack`                            | Build production lulus; 61 entri precache, sekitar 2,86 MiB   |
| `node scripts/test-browser.mjs`                   | Ketiga kelompok regresi Chrome lulus pada profil browser baru |

Tes unit mencakup placeholder SSR, jam perangkat dan resume tab, pergantian tanggal/zona waktu, jadwal besok setelah Isya, cache terpisah per lokasi/tanggal, pembatalan request, penulisan cache bersamaan, pemulihan audio, migrasi pengaturan, progres/reset/undo, pencarian, target bacaan, aset offline, dan MIME/fallback ekspor.

Tes browser memeriksa progres setelah reload dan offline, reconnect tanpa reload dokumen, favorit, pencarian, tautan langsung, tata letak poster mobile, label kontrol, tombol Escape pada pengaturan poster, byte JPEG, serta unduhan setelah native share ditolak. Tes menunggu pemasangan service worker pertama selesai sebelum reload dan mencatat status worker saat gagal.

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

Offline memerlukan kunjungan awal saat online. Progres, favorit, dan pengaturan tersimpan di perangkat, tanpa sinkronisasi akun; lihat [kebijakan offline](offline.md).
