// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (req: NextApiRequest, res: NextApiResponse<Data>): any => {
  res.status(200).json({ name: 'John Doe' });
};
