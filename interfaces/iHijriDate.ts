// Internal
import { iSwrResponse } from '@interfaces';

interface iPrayingTime {
  id: number;
  name: string;
  time: string;
}

interface iHijriDate extends iSwrResponse {
  hijriDate: string;
  prayingTimes: iPrayingTime[];
}

export default iHijriDate;
