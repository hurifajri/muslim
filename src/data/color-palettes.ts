export const COLOR_PALETTE_IDS = [
  'sakura',
  'lavender',
  'rose',
  'sunflower',
  'forget-me-not',
  'jasmine',
  'marigold',
  'jade',
  'dahlia',
  'magnolia',
] as const;

export type ColorPaletteId = (typeof COLOR_PALETTE_IDS)[number];

export type ColorPalette = {
  id: ColorPaletteId;
  name: string;
  flower: string;
  /** Whether this palette uses light or dark base theme */
  mode: 'light' | 'dark';
  /** The swatch preview color */
  previewColor: string;
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'sakura',
    name: 'Pink',
    flower: 'Sakura',
    mode: 'light',
    previewColor: '#ffb0b5',
  },
  {
    id: 'lavender',
    name: 'Ungu',
    flower: 'Lavender',
    mode: 'light',
    previewColor: '#c4a0e8',
  },
  {
    id: 'rose',
    name: 'Merah',
    flower: 'Rose',
    mode: 'light',
    previewColor: '#d45050',
  },
  {
    id: 'sunflower',
    name: 'Kuning',
    flower: 'Sunflower',
    mode: 'light',
    previewColor: '#f0c850',
  },
  {
    id: 'forget-me-not',
    name: 'Biru',
    flower: 'Forget-me-not',
    mode: 'light',
    previewColor: '#78a8e8',
  },
  {
    id: 'jasmine',
    name: 'Putih',
    flower: 'Melati',
    mode: 'light',
    previewColor: '#d4c8b0',
  },
  {
    id: 'marigold',
    name: 'Oranye',
    flower: 'Marigold',
    mode: 'light',
    previewColor: '#f0a848',
  },
  {
    id: 'jade',
    name: 'Hijau',
    flower: 'Jade Vine',
    mode: 'light',
    previewColor: '#70c088',
  },
  {
    id: 'dahlia',
    name: 'Hitam',
    flower: 'Black Dahlia',
    mode: 'dark',
    previewColor: '#484050',
  },
  {
    id: 'magnolia',
    name: 'Krem',
    flower: 'Magnolia',
    mode: 'light',
    previewColor: '#d8c4a0',
  },
];

export const DEFAULT_PALETTE: ColorPaletteId = 'sakura';
