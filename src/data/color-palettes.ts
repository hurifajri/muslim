export const COLOR_PALETTE_IDS = [
  'jasmine',
  'dahlia',
  'sakura',
  'rose',
  'sunflower',
  'marigold',
  'jade',
  'forget-me-not',
  'lavender',
  'magnolia',
] as const;

export type ColorPaletteId = (typeof COLOR_PALETTE_IDS)[number];

export type ColorPalette = {
  id: ColorPaletteId;
  name: string;
  flower: string;
  /** Whether this palette uses light or dark base theme */
  mode: 'light' | 'dark';
  /** The swatch preview color (used for theme_color) */
  previewColor: string;
  /** The background color (used for background_color) */
  backgroundColor: string;
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'jasmine',
    name: 'Putih',
    flower: 'Melati',
    mode: 'light',
    previewColor: '#d4c8b0',
    backgroundColor: '#f0ebe2',
  },
  {
    id: 'dahlia',
    name: 'Hitam',
    flower: 'Dahlia Hitam',
    mode: 'dark',
    previewColor: '#484050',
    backgroundColor: '#2a2830',
  },
  {
    id: 'sakura',
    name: 'Merah Muda',
    flower: 'Sakura',
    mode: 'light',
    previewColor: '#ffb0b5',
    backgroundColor: '#ffd3d6',
  },
  {
    id: 'rose',
    name: 'Merah',
    flower: 'Mawar',
    mode: 'light',
    previewColor: '#d45050',
    backgroundColor: '#f0c4be',
  },
  {
    id: 'sunflower',
    name: 'Kuning',
    flower: 'Bunga Matahari',
    mode: 'light',
    previewColor: '#f0c850',
    backgroundColor: '#faedc5',
  },
  {
    id: 'marigold',
    name: 'Oranye',
    flower: 'Kenikir',
    mode: 'light',
    previewColor: '#f0a848',
    backgroundColor: '#f8d8b8',
  },
  {
    id: 'jade',
    name: 'Hijau',
    flower: 'Bunga Giok',
    mode: 'light',
    previewColor: '#70c088',
    backgroundColor: '#c2e6d0',
  },
  {
    id: 'forget-me-not',
    name: 'Biru',
    flower: 'Bunga Telang',
    mode: 'light',
    previewColor: '#78a8e8',
    backgroundColor: '#c5d8f5',
  },
  {
    id: 'lavender',
    name: 'Ungu',
    flower: 'Lavender',
    mode: 'light',
    previewColor: '#c4a0e8',
    backgroundColor: '#e8d5f5',
  },
  {
    id: 'magnolia',
    name: 'Krem',
    flower: 'Cempaka Putih',
    mode: 'light',
    previewColor: '#d8c4a0',
    backgroundColor: '#f2e8da',
  },
];

export const DEFAULT_PALETTE: ColorPaletteId = 'jasmine';
