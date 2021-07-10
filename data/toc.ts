import { routes } from '@utils';

const toc = [
  {
    id: 1,
    title: 'Dzikir Pagi',
    group: 'Dzikir',
    link: routes.dzikir('pagi'),
  },
  {
    id: 2,
    title: 'Dzikir Petang',
    group: 'Dzikir',
    link: routes.dzikir('petang'),
  },
  {
    id: 3,
    title: 'Doa Quran',
    group: 'Doa',
    link: routes.doa('quran'),
  },
  {
    id: 4,
    title: 'Doa Nabi',
    group: 'Doa',
    link: routes.doa('nabi'),
  },
  {
    id: 5,
    title: 'Doa Solat',
    group: 'Doa',
    link: routes.doa('solat'),
  },
];

export default toc;
