export const BACKGROUNDS = Array.from(
  { length: 12 },
  (_, i) => `/bgs/bg-${i + 1}.webp`
);
// Arabic font size in pixels on the 1080 × 1920 export.
export const MIN_FONT_SIZE = 24;
export const MAX_FONT_SIZE = 96;
export type PosterOptions = {
  bgIndex: number;
  showTitle: boolean;
  showArabic: boolean;
  showTranslation: boolean;
  textOutline: boolean;
  fontSize: number;
  opacity: number;
};
export const defaultPosterOptions: PosterOptions = {
  bgIndex: 0,
  showTitle: true,
  showArabic: true,
  showTranslation: true,
  textOutline: false,
  fontSize: 68,
  opacity: 60,
};
