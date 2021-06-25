// Internal
import { iSwrResponse } from '@interfaces';

interface iHijriDate extends iSwrResponse {
  hijriDate: string;
  timings: Record<string, string>;
}

export default iHijriDate;
