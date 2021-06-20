// Internal
import { SwrResponse, Toc } from '@/interfaces';

interface TocSwrResponse extends SwrResponse {
  contents: Toc;
}

export default TocSwrResponse;
