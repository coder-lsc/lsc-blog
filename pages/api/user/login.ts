import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity/index';

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verify = '' } = req.body;
  const db = await prepareConnection();
  console.log(db, 'db');
  
  const userRepo = db.getRepository(User);
  console.log(userRepo, 'userRepo');
  
  const users = await userRepo.find()
  console.log(users)
  res?.status(200)?.json({ phone, verify, code: 0 });
}

export default withIronSessionApiRoute(login, ironOptions);
