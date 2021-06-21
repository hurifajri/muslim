// Eksternal
import type { NextApiRequest, NextApiResponse } from 'next';

// Internal
import { toc } from '@/data';
import type { Toc } from '@/interfaces';

export default (req: NextApiRequest, res: NextApiResponse<Toc>): void => {
  res.status(200).json(toc);
};
