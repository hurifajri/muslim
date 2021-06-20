// Eksternal
import type { NextApiRequest, NextApiResponse } from 'next';

// Internal
import { toc } from '@/data';
import type { ToC } from '@/interfaces';

export default (req: NextApiRequest, res: NextApiResponse<ToC>): void => {
  res.status(200).json(toc);
};
