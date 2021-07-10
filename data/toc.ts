import { routes } from '@utils';

const toc = [
  {
    id: 1,
    title: 'Dzikir Pagi',
    link: routes.dzikir('pagi'),
    group: 'dzikir',
  },
  {
    id: 2,
    title: 'Dzikir Petang',
    link: routes.dzikir('petang'),
    group: 'dzikir',
  },
  {
    id: 3,
    title: 'Doa Quran',
    link: routes.doa('quran'),
    group: 'doa',
  },
  {
    id: 4,
    title: 'Doa Nabi',
    link: routes.doa('nabi'),
    group: 'doa',
  },
  {
    id: 5,
    title: 'Doa Solat',
    link: routes.doa('solat'),
    group: 'doa',
  },
];

export default toc;
