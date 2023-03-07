import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from '..';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config';
import { setCookie } from 'utils';
import request from 'service/fetch';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity';

async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);

  const { code } = req?.query || {};
  const githubClientID = '50e3021212a722363f00';
  const githubSecret = '7a70b823efe67c285bf582f0309467ca4d19b4fd';
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecret}&code=${code}`;

  const result = await request.post(
    url,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    },
  );
  console.log(result, 'result');

  const { access_token } = result as any;
  console.log('access_token', access_token);

  const githubUserInfo: any = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`,
    },
  });

  console.log('githubUserInfo', githubUserInfo);

  const { id: github_id } = githubUserInfo;

  const db = await prepareConnection();
  const userAuth = await db.getRepository(UserAuth).findOne(
    {
      identifier: github_id,
      identity_type: 'github',
    },
    {
      relations: ['user'],
    },
  );

  if (userAuth) {
    // 之前登录过的用户 直接从user表里取数据 并更新credential
    const user = userAuth.user;
    console.log('user', user);

    const { id, avatar, nickname } = user;
    userAuth.credential = access_token;
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
  } else {
    // 创建一个新用户
    const { login = '', avatar_url, id: github_id } = githubUserInfo;
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;
    user.job = '暂无';
    user.introduce = '暂无';

    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = github_id;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = await userAuthRepo.save(userAuth);

    console.log('resUserAuth', resUserAuth);

    const { id, avatar, nickname } = resUserAuth?.user || {};
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;
  }

  await session.save();

  console.log('setcookie', session);
  

  setCookie(cookies, {
    userId: session.id,
    nickname: session.nickname,
    avatar: session.avatar,
  });

  res.redirect(307, '/')
}

export default withIronSessionApiRoute(redirect, ironOptions);
