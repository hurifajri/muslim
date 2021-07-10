const routes = {
  home: '/',
  dzikir: (time: 'pagi' | 'petang') => `/dzikir/${time}`,
  doa: (type: string) => `/doa/${type}`,
};

export default routes;
