// Internal
import { SwrResponse } from '@/interfaces';
interface Today extends SwrResponse {
  timings: Record<string, string>;
  today: Record<string, string>;
}

export default Today;
