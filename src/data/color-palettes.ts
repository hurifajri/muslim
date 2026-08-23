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
  /** The main swatch color (light mode --app-6) */
  previewColor: string;
  /** The dark mode swatch color (dark mode --app-6) */
  previewColorDark: string;
};

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'sakura',
    name: 'Pink',
    flower: 'Sakura',
    previewColor: '#ffb0b5',
    previewColorDark: '#8c3a42',
  },
  {
    id: 'lavender',
    name: 'Ungu',
    flower: 'Lavender',
    previewColor: '#c4a0e8',
    previewColorDark: '#6b3d96',
  },
  {
    id: 'rose',
    name: 'Merah',
    flower: 'Rose',
    previewColor: '#e87878',
    previewColorDark: '#8c3535',
  },
  {
    id: 'sunflower',
    name: 'Kuning',
    flower: 'Sunflower',
    previewColor: '#f0c850',
    previewColorDark: '#7a6828',
  },
  {
    id: 'forget-me-not',
    name: 'Biru',
    flower: 'Forget-me-not',
    previewColor: '#78a8e8',
    previewColorDark: '#355090',
  },
  {
    id: 'jasmine',
    name: 'Putih',
    flower: 'Melati',
    previewColor: '#d4c8b0',
    previewColorDark: '#5a5345',
  },
  {
    id: 'marigold',
    name: 'Oranye',
    flower: 'Marigold',
    previewColor: '#f0a848',
    previewColorDark: '#7a5828',
  },
  {
    id: 'jade',
    name: 'Hijau',
    flower: 'Jade Vine',
    previewColor: '#70c088',
    previewColorDark: '#35603f',
  },
  {
    id: 'dahlia',
    name: 'Hitam',
    flower: 'Black Dahlia',
    previewColor: '#9a959c',
    previewColorDark: '#484050',
  },
  {
    id: 'magnolia',
    name: 'Krem',
    flower: 'Magnolia',
    previewColor: '#d8c4a0',
    previewColorDark: '#5c4e38',
  },
];

export const DEFAULT_PALETTE: ColorPaletteId = 'sakura';
