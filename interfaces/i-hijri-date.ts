// Internal
import { iSwrResponse } from '@interfaces';

interface iPrayingTimeObject {
  id: number;
  name: string;
  time: string;
}

type iPrayingTime = iPrayingTimeObject[];

interface iHijriDate extends iSwrResponse {
  hijriDate: string;
  prayingTimes: iPrayingTime;
}

export default iHijriDate;
