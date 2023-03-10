import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from '..';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config';
import { clearCookie } from 'utils';

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);

  await session.destroy();
  clearCookie(cookies);

  res.status(200).json({
    code: 0,
    msg: 'ιεΊζε',
    data: {},
  });
}

export default withIronSessionApiRoute(logout, ironOptions);
