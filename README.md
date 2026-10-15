# Muslim

Jadwal sholat, dzikir, dan doa dengan progres bacaan serta favorit yang tersimpan di perangkat.

```sh
pnpm install
pnpm dev
```

Konfigurasi `.env.local`: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_ALADHAN_API_URL` (misalnya `https://api.aladhan.com/v1`), dan `NEXT_PUBLIC_NOMINATIM_API_URL` (misalnya `https://nominatim.openstreetmap.org`).

## Pemeriksaan

```sh
pnpm test
pnpm check:types
pnpm exec eslint src
pnpm exec prettier --check src scripts tests
pnpm build
```

Tes unit menggunakan Node 24+ dan esbuild. Tes browser menggunakan versi `agent-browser` yang dipasang melalui dev dependency proyek; instalasi global tidak diperlukan. Unduh Chrome untuk pengujian sekali, lalu jalankan build production dan server lokal:

```sh
pnpm install
pnpm test:browser:install # Sekali untuk mengunduh Chrome for Testing
pnpm build
pnpm start --hostname 127.0.0.1 --port 3100
# Terminal lain:
pnpm test:browser
```

`TEST_BASE_URL`, `AGENT_BROWSER_BIN`, dan `CHROME_BIN` dapat mengatur alamat server serta lokasi executable. Tes membuat sesi browser sendiri, memeriksa reload/offline/reconnect, favorit, tautan bacaan, dan ekspor JPEG. Profil browser pengguna tidak digunakan.

Jika Chrome sudah terpasang, unduhan browser dapat dilewati dengan menentukan executable, misalnya pada macOS:

```sh
CHROME_BIN='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' pnpm test:browser
```

`ENOENT` menunjukkan executable tidak ditemukan. Jalankan `pnpm install` dan hapus atau betulkan `AGENT_BROWSER_BIN` jika pernah diatur. Pesan `Server belum siap` berarti server production pada `TEST_BASE_URL` belum dapat diakses.

Jika lingkungan membatasi port subprocess Turbopack, `pnpm exec next build --webpack` dapat dipakai untuk pemeriksaan alternatif. Build masih memerlukan akses Google Fonts untuk font aplikasi.

Lihat [hasil verifikasi](docs/verification.md), [perilaku offline](docs/offline.md), [catatan transliterasi](docs/content.md), dan [spesifikasi perubahan](SPEC.md).
