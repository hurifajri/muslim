// Internal
import isServer from '@helpers/isServer';

const useInitialLocation = () => {
  let initialLocation = '';
  if (!isServer)
    initialLocation = localStorage?.getItem('mslm-location') ?? 'jakarta';

  return { initialLocation };
};

export default useInitialLocation;
