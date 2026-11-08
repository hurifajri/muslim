# Changelog

## [2.1.0](https://github.com/hurifajri/muslim/compare/v2.0.0...v2.1.0) (2026-11-08)


### Features

* add optional click sound on dhikr counter ([e7dea5c](https://github.com/hurifajri/muslim/commit/e7dea5c58c074744a24df44fb5e950ffc7bfb97e))
* add offline service worker support and PWA install prompt ([9592af0](https://github.com/hurifajri/muslim/commit/9592af057e49d5d61519ebd0df69cd46485137eb))


### Bug Fixes

* prevent server/client clock hydration mismatch ([4d8b9e6](https://github.com/hurifajri/muslim/commit/4d8b9e6606e905f20f24abbce9a5e497818bc74c))
* handle Safari AudioContext interruption and persist sound settings ([74a3e86](https://github.com/hurifajri/muslim/commit/74a3e86bfa19dcc700275b92236087cdbc4507ab))
* decode poster image before export, add safe-area top margin, and align PWA theme-color ([d8a0b59](https://github.com/hurifajri/muslim/commit/d8a0b596faad9942217f2b6a6935a1cf1ec96284))
* fix theme-color MutationObserver loop and install prompt SSR hydration mismatch ([f0bd661](https://github.com/hurifajri/muslim/commit/f0bd6617e2f959e1142ad017085a3d5e371b77fc))
* clean up legacy PWA service worker and resize palette swatch buttons in settings ([76dc51d](https://github.com/hurifajri/muslim/commit/76dc51dab6f4abebf5e93cf0a9fe35bd76ac623c), [655ee4a](https://github.com/hurifajri/muslim/commit/655ee4a46d71ead9c3efd8cc7d5a04a3a98dd2b3))
* add poster customization popover, adjust responsive poster height, and sync dynamic theme-color ([264b5ed](https://github.com/hurifajri/muslim/commit/264b5ed7ea8136c46c711596ef4d75b9fc663c70), [203f5e3](https://github.com/hurifajri/muslim/commit/203f5e3ea056f469938bd28e9449182e01a38ecc), [ae85dea](https://github.com/hurifajri/muslim/commit/ae85dea590b155dba1c55bd21510f418d587c81c))
* use semantic secondary gradient token in header and install prompt ([141049a](https://github.com/hurifajri/muslim/commit/141049a45549acb3b0ccdf3f224a38bf4a46b9b2), [deff9ae](https://github.com/hurifajri/muslim/commit/deff9ae2ce48b53fdc08d1f749f2552215f29333))
* add top and bottom safe-area padding to side sheets ([e9bf8b4](https://github.com/hurifajri/muslim/commit/e9bf8b4473cd16fd909b67e672a856395ce7a40d))
* sync app version in settings with package.json ([#63](https://github.com/hurifajri/muslim/issues/63)) ([e32019a](https://github.com/hurifajri/muslim/commit/e32019a77fc68638cd1dd3fc485f628811912208))

## [2.0.0](https://github.com/hurifajri/muslim/compare/v1.0.0...v2.0.0) (2026-08-27)


### ⚠ BREAKING CHANGES

* migrate from Next.js Pages Router and Chakra UI to Next.js App Router, Tailwind CSS v4, shadcn/Radix UI, Zustand, and TanStack Query, and remove the legacy /contact page ([1409c17](https://github.com/hurifajri/muslim/commit/1409c1794ba773e788fbe45022c8e85a99f94c39))


### Features

* add shareable dua poster generator with customizable background, opacity, font size, and image export ([cbb8bac](https://github.com/hurifajri/muslim/commit/cbb8bacf3154cbb3c863d7363bc2b901d6cb787b))
* add multi-palette color themes persisted via cookies and synced with PWA manifest ([2fbf503](https://github.com/hurifajri/muslim/commit/2fbf503edcdd48dc39e9aa0bd3850b5627510775), [085c33f](https://github.com/hurifajri/muslim/commit/085c33f3bfe1806af02edfe23954c9e3b0fa7f20))
* persist selected location in cookies with server hydration and localize Gregorian and Hijri dates ([16300ac](https://github.com/hurifajri/muslim/commit/16300ac1fdcec8a09d7df0036f469d9746e5655e), [2371c3c](https://github.com/hurifajri/muslim/commit/2371c3cc60e25735e8e0bcc4938b889155047eb8))
* add responsive media query and mobile viewport detection hooks ([0585f4d](https://github.com/hurifajri/muslim/commit/0585f4db5f0a528d8d261b64f1f3be0eaf19e762))


### Bug Fixes

* improve poster layout, aspect ratio, and download reliability ([9e45028](https://github.com/hurifajri/muslim/commit/9e450280546ead4407a819b406b697458d02fc66))
* correct Arabic text, translations, and typos across doa and dzikir contents ([3511960](https://github.com/hurifajri/muslim/commit/351196073fd8fbb3c4e09287bcb0c0511e1410d7), [b35e8b7](https://github.com/hurifajri/muslim/commit/b35e8b7b80d4fb3fb34ff030be858b54ac976ccb))
* adjust color tokens and update build configuration ([a33f514](https://github.com/hurifajri/muslim/commit/a33f514237dc57ff8e8d6f1015d41ce1d37292a6), [f53fd47](https://github.com/hurifajri/muslim/commit/f53fd478d8f4e7fe5cf08b680b86d919152a6fc6))

## [1.0.0](https://github.com/hurifajri/muslim/commits/v1.0.0) (2021-07-18)


### Features

* add daily prayer schedule with city and country location picker ([70a8b55](https://github.com/hurifajri/muslim/commit/70a8b55c1b9242c8ceece34c9d20b0668aa6e07e), [373cf18](https://github.com/hurifajri/muslim/commit/373cf18e20c987c4960e9e233441bab2e4a6944b))
* add morning and evening dzikir, daily prayers (Al-Qur'an, Prophet, and Salah), and wisdom quotes ([a107f29](https://github.com/hurifajri/muslim/commit/a107f29865864d3e4f7360e2c02a2c8d75753ec8))
* add light/dark theme toggle, dhikr counter, and reading display settings for translation, transliteration, and benefits ([5a0085c](https://github.com/hurifajri/muslim/commit/5a0085c0a102b756a909394ae7b138c62a1994d0))
* add contact form, PWA manifest, and Android TWA digital asset links ([ea980ff](https://github.com/hurifajri/muslim/commit/ea980ff73ff55a7941a64301ac8944e2cb83ee61), [026971a](https://github.com/hurifajri/muslim/commit/026971a149140581c3060eb41f69cf273ba68f64), [ec4f695](https://github.com/hurifajri/muslim/commit/ec4f6952c823c5f982cb38e379280e2c693c430e))


### Bug Fixes

* fix Hijri date offset and z-index overlap issues ([6155bb8](https://github.com/hurifajri/muslim/commit/6155bb8cd21fed4b121cae5845d77ddab768f8cb), [99c2620](https://github.com/hurifajri/muslim/commit/99c26207688127f5d7eb131b77a052107bdfd253))
* resolve TypeScript, ESLint, and UI styling issues ([6322c80](https://github.com/hurifajri/muslim/commit/6322c80f4a46b73fc08407ad8dbf372f66270ea4), [9f7996e](https://github.com/hurifajri/muslim/commit/9f7996ef44950d87f7a4c418e67207407b90c4ca), [b6f43bf](https://github.com/hurifajri/muslim/commit/b6f43bf2585abc98f1b79b602c8180f1b885396a))
