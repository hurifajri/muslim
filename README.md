# Muslim

Jadwal salat, dzikir, dan doa dengan progres bacaan serta favorit yang tersimpan di perangkat.

```sh
pnpm install
pnpm dev
```

Konfigurasi wajib di `.env.local`: `NEXT_PUBLIC_APP_URL`, `ALADHAN_API_URL` (misalnya `https://api.aladhan.com/v1`), dan `NOMINATIM_API_URL` (misalnya `https://nominatim.openstreetmap.org`); lihat `.env.example`. Atur variabel yang sama pada lingkungan deployment. Kedua URL penyedia harus memakai nama privat tersebut; nama lama dengan awalan `NEXT_PUBLIC_` tidak lagi dibaca dan tidak ada URL fallback.

Konfigurasi dipusatkan di `src/env.ts`; URL penyedia divalidasi dengan Valibot dan hanya dapat diakses melalui `env` di server. Konfigurasi yang hilang, kosong, atau berupa URL tidak valid langsung ditolak.

Jadwal salat diambil melalui `/api/prayer-times`, dengan tanggal `YYYY-MM-DD` yang mengikuti zona waktu lokasi terpilih. Server memvalidasi parameter dan respons, menggabungkan request identik, serta menyimpan maksimal 256 jadwal selama satu jam. Kunci cache mencakup mode pencarian, kota/negara atau koordinat, tanggal, metode perhitungan, dan penyesuaian kalender. Waktu pengambilan asli diteruskan ke cache perangkat; respons gagal atau bertanggal salah tidak disimpan. Timeout penyedia enam detik memberi waktu bagi fallback perangkat sebelum timeout klien delapan detik.

Request Aladhan yang belum tersimpan dibatasi menjadi delapan per jendela berjalan satu detik dalam satu proses. Cache tetap dapat dibaca saat pembatasan aktif; `Retry-After` penyedia menunda request baru dari proses tersebut. Cache dan limiter ini **tidak dibagi antar-instance**. Jika deployment memakai beberapa instance dengan IP keluar yang sama, arahkan `ALADHAN_API_URL` ke gateway dengan cache/limiter bersama. [Aladhan membatasi trafik berdasarkan IP sumber](https://community.islamic.network/d/2-is-there-a-rate-limit-on-the-apis); batas lokal tidak menjamin kuota untuk seluruh deployment.

Pencarian kota dijalankan setelah tombol Cari/Enter melalui `/api/location/search`; geolokasi memakai `/api/location/reverse`. Endpoint server memvalidasi parameter, mengidentifikasi aplikasi ke penyedia, menggabungkan request identik, menyimpan maksimal 128 hasil selama satu jam, dan membatasi search/reverse bersama menjadi satu request per detik dalam satu proses. Kegagalan tidak dicache dan `Retry-After` penyedia dihormati. Isikan `NEXT_PUBLIC_APP_URL` dengan alamat aplikasi yang sebenarnya.

Jika memakai `https://nominatim.openstreetmap.org`, ikuti [kebijakan Nominatim](https://operations.osmfoundation.org/policies/nominatim/): tanpa autocomplete, maksimal satu request per detik untuk seluruh aplikasi, dan atribusi OpenStreetMap. **Limiter lokal tidak terdistribusi.** Deployment dengan beberapa proses/instance atau fungsi serverless harus mengarahkan `NOMINATIM_API_URL` ke gateway bersama yang menerapkan cache dan batas global, atau ke penyedia dengan kapasitas yang sesuai; jangan mengandalkan limiter per proses untuk membatasi trafik seluruh deployment.

## Komponen

Gunakan komponen bersama dari `src/components/ui`. Pencarian lokasi memakai `Combobox` resmi shadcn, yang membutuhkan `@base-ui/react`, di dalam dialog/drawer Radix. Input tetap memakai `InputGroup`; hasil menggunakan pilihan combobox yang mengambang dan dapat digulir, dengan atribusi di bawah daftar. Panah menyorot pilihan, Enter memilih, dan Escape menutup hasil terlebih dahulu sebelum dialog/drawer. Pencarian hanya dikirim melalui Cari/Enter. Pengaturan menggunakan `ScrollArea` dengan scrollbar warna tema yang muncul saat digulir dan menghilang ketika berhenti.

Props komponen memakai `type NamaComponentProps = Readonly<{ ... }>`; wrapper UI tetap mewarisi props primitive melalui `Readonly<React.ComponentProps<typeof Primitive>>`. `Readonly` membatasi perubahan properti pada level TypeScript, bukan melakukan freeze objek saat runtime.

## Pemeriksaan

```sh
pnpm exec next typegen # Sekali pada checkout baru atau setelah menghapus .next
pnpm check
pnpm test
pnpm build
```

`pnpm check` menjalankan lint, pemeriksaan format, dan TypeScript tanpa memperbaiki kode. Gunakan `pnpm fix` untuk perbaikan otomatis, atau `pnpm lint:fix` / `pnpm format:fix` secara terpisah. `pnpm check:packages` hanya menampilkan pembaruan dependency; `pnpm update:packages` mengubah versi di manifest. Generasi tipe Next dilakukan terpisah karena dapat memperbarui `next-env.d.ts`.

Workflow [Checks](.github/workflows/check.yml) menjalankan pemeriksaan pada push/pull request dengan Node 24 dan versi pnpm dari `packageManager`: frozen install, generasi tipe, check, tes unit, build Webpack, dan regresi browser. Server serta sesi browser tes dibersihkan setelah selesai; workflow tidak melakukan deployment.

Tes unit menggunakan Node 24+ dan esbuild. Tes browser menggunakan versi `agent-browser` yang dipasang melalui dev dependency proyek; instalasi global tidak diperlukan. Unduh Chrome untuk pengujian sekali, lalu jalankan build production dan server lokal:

```sh
pnpm install
pnpm test:browser:install # Sekali untuk mengunduh Chrome for Testing
pnpm build
pnpm start --hostname 127.0.0.1 --port 3100
# Terminal lain:
pnpm test:browser
```

`TEST_BASE_URL`, `AGENT_BROWSER_BIN`, dan `CHROME_BIN` dapat mengatur alamat server serta lokasi executable. Tes membuat sesi browser sendiri, memeriksa reload/offline/reconnect, favorit dan riwayat filter, sorotan tautan bacaan, ekspor JPEG, pencarian lokasi melalui keyboard/pointer, serta pemasangan saat penyimpanan diblokir. Respons geocoder dan jadwal pada skenario interaksi memakai fixture; cache dan limiter server diuji terpisah lewat `pnpm test`. Regresi jadwal juga memeriksa bahwa service worker tidak memberikan salinan API lama ketika offline. Profil browser pengguna tidak digunakan.

Regresi tambahan mencakup perubahan bersamaan pada dua tab, status penyimpanan sementara, dan interaksi pemulihan error tanpa provider aplikasi. Urutan semua bacaan dipusatkan di `src/lib/reading-sequence.ts`; target repetisi hanya dipakai saat menghitung progres. Pemutaran audio belum diimplementasikan.

Jika Chrome sudah terpasang, unduhan browser dapat dilewati dengan menentukan executable, misalnya pada macOS:

```sh
CHROME_BIN='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' pnpm test:browser
```

`ENOENT` menunjukkan executable tidak ditemukan. Jalankan `pnpm install` dan hapus atau betulkan `AGENT_BROWSER_BIN` jika pernah diatur. Pesan `Server belum siap` berarti server production pada `TEST_BASE_URL` belum dapat diakses.

Jika lingkungan membatasi port subprocess Turbopack, `pnpm exec next build --webpack` dapat dipakai untuk pemeriksaan alternatif. Build masih memerlukan akses Google Fonts untuk font aplikasi.

Lihat [hasil verifikasi](docs/verification.md), [perilaku offline](docs/offline.md), [catatan transliterasi](docs/content.md), dan [spesifikasi perubahan](SPEC.md).
