import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verify = '' } = req.body;
  res?.status(200)?.json({ phone, verify, code: 0 });
}

export default withIronSessionApiRoute(login, ironOptions);
