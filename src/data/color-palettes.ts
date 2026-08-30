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
    themeColor: '#d4c8b0',
    backgroundColor: '#f0ebe2',
  },
  {
    id: 'dahlia',
    name: 'Hitam',
    flower: 'Dahlia Hitam',
    mode: 'dark',
    themeColor: '#484050',
    backgroundColor: '#2a2830',
  },
  {
    id: 'sakura',
    name: 'Merah Muda',
    flower: 'Sakura',
    mode: 'light',
    themeColor: '#ffb0b5',
    backgroundColor: '#ffd3d6',
  },
  {
    id: 'sunflower',
    name: 'Kuning',
    flower: 'Bunga Matahari',
    mode: 'light',
    themeColor: '#f0c850',
    backgroundColor: '#faedc5',
  },
  {
    id: 'marigold',
    name: 'Oranye',
    flower: 'Kenikir',
    mode: 'light',
    themeColor: '#f0a848',
    backgroundColor: '#f8d8b8',
  },
  {
    id: 'jade',
    name: 'Hijau',
    flower: 'Bunga Giok',
    mode: 'light',
    themeColor: '#70c088',
    backgroundColor: '#c2e6d0',
  },
  {
    id: 'forget-me-not',
    name: 'Biru',
    flower: 'Bunga Telang',
    mode: 'light',
    themeColor: '#78a8e8',
    backgroundColor: '#c5d8f5',
  },
  {
    id: 'lavender',
    name: 'Ungu',
    flower: 'Lavender',
    mode: 'light',
    themeColor: '#c4a0e8',
    backgroundColor: '#e8d5f5',
  },
];

export const DEFAULT_PALETTE: ColorPaletteId = 'jasmine';
