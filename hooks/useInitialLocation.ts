const useInitialLocation = () => {
  const isServer = typeof window === 'undefined';

  let initialLocation = '';
  if (!isServer)
    initialLocation = localStorage?.getItem('mslm-location') ?? 'jakarta';

  return { initialLocation, isServer };
};

export default useInitialLocation;
