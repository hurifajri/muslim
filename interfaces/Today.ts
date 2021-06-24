// Internal
import { SwrResponse } from '@/interfaces';

interface Today extends SwrResponse {
  today: Record<string, string>;
}

export default Today;
