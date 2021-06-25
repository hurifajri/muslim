// Internal
import { iSwrResponse } from '@interfaces';

interface iToday extends iSwrResponse {
  timings: Record<string, string>;
  today: Record<string, string>;
}

export default iToday;
