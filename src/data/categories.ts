export const categories = [
  {
    id: 1,
    slug: 'pagi',
    title: 'Zikir Pagi',
    link: '/dzikir/pagi',
    category: 'dzikir',
  },
  {
    id: 2,
    slug: 'petang',
    title: 'Zikir Petang',
    link: '/dzikir/petang',
    category: 'dzikir',
  },
  {
    id: 3,
    slug: 'quran',
    title: "Doa Al-Qur'an",
    link: '/doa/quran',
    category: 'doa',
  },
  {
    id: 4,
    slug: 'nabi',
    title: 'Doa Nabi',
    link: '/doa/nabi',
    category: 'doa',
  },
  {
    id: 5,
    slug: 'salat',
    title: 'Doa Salat',
    link: '/doa/salat',
    category: 'doa',
  },
] as const;

export type Collection = 'dzikir' | 'doa';
export function getCategory(collection: string, slug: string) {
  return categories.find(
    item => item.category === collection && item.slug === slug
  );
}
