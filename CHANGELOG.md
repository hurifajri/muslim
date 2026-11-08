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
