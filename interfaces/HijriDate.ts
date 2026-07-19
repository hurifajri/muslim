// Internal
import { SwrResponse } from '@interfaces/SwrResponse';

interface PrayingTime {
  id: number;
  name: string;
  time: string;
}

export interface HijriDate extends SwrResponse {
  hijriDate: string;
  prayingTimes: PrayingTime[];
}
