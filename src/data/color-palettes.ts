export const COLOR_PALETTE_IDS = [
  'jasmine',
  'dahlia',
  'sakura',
  'sunflower',
  'marigold',
  'jade',
  'forget-me-not',
  'lavender',
] as const;

export type ColorPaletteId = (typeof COLOR_PALETTE_IDS)[number];

export type ColorPalette = {
  id: ColorPaletteId;
  name: string;
  flower: string;
  /** Whether this palette uses light or dark base theme */
  mode: 'light' | 'dark';
  /** The swatch preview color (used for theme_color) */
  themeColor: string;
  /** The background color (used for background_color) */
  backgroundColor: string;
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'jasmine',
    name: 'Putih',
    flower: 'Melati',
    mode: 'light',
    themeColor: 'oklch(30.2% 0.04445 131.78)',
    backgroundColor: 'oklch(94.281% 0.00123 107.746)',
  },
  {
    id: 'dahlia',
    name: 'Hitam',
    flower: 'Dahlia Hitam',
    mode: 'dark',
    themeColor: 'oklch(88.144% 0.02114 300.977)',
    backgroundColor: 'oklch(28.228% 0.01478 296.841)',
  },
  {
    id: 'sakura',
    name: 'Merah Muda',
    flower: 'Sakura',
    mode: 'light',
    themeColor: 'oklch(83.38% 0.09278 15.029)',
    backgroundColor: 'oklch(87.197% 0.04662 12.999)',
  },
  {
    id: 'sunflower',
    name: 'Kuning',
    flower: 'Bunga Matahari',
    mode: 'light',
    themeColor: 'oklch(84.601% 0.14244 90.4)',
    backgroundColor: 'oklch(94.639% 0.05373 92.162)',
  },
  {
    id: 'marigold',
    name: 'Oranye',
    flower: 'Kenikir',
    mode: 'light',
    themeColor: 'oklch(78.406% 0.1385 70.802)',
    backgroundColor: 'oklch(90.091% 0.05528 66.988)',
  },
  {
    id: 'jade',
    name: 'Hijau',
    flower: 'Bunga Giok',
    mode: 'light',
    themeColor: 'oklch(74.137% 0.11356 152.472)',
    backgroundColor: 'oklch(89.298% 0.04813 158.558)',
  },
  {
    id: 'forget-me-not',
    name: 'Biru',
    flower: 'Bunga Telang',
    mode: 'light',
    themeColor: 'oklch(72.31% 0.10724 255.905)',
    backgroundColor: 'oklch(87.725% 0.04525 258.796)',
  },
  {
    id: 'lavender',
    name: 'Ungu',
    flower: 'Lavender',
    mode: 'light',
    themeColor: 'oklch(76.359% 0.10767 306.848)',
    backgroundColor: 'oklch(89.818% 0.04772 311.639)',
  },
];

export const DEFAULT_PALETTE: ColorPaletteId = 'jasmine';
