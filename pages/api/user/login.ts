import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity/index';
import { ISession } from '..';

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;

  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const db = await prepareConnection();

  const userAuthRepo = db.getRepository(UserAuth);

  if (String(session.verifyCode) === String(verify)) {
    // 验证码正确
    const userAuth = await userAuthRepo.findOne(
      {
        identifier: phone,
        identity_type,
      },
      { relations: ['user'] },
    );

    // console.log(userAuth, 'userAuth');

    if (userAuth) {
      // 已存在的用户
      const user = userAuth.user;
      const { id, nickname, avatar } = user;
      session.id = id;
      session.nickname = nickname;
      session.avatar = avatar;
    } else {
      // 新用户
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 1000)}`;
      user.avatar = '/images/default_avatar.jpg';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;
      session.id = id;
      session.nickname = nickname;
      session.avatar = avatar;
      console.log(resUserAuth);
    }
    await session.save();
    res?.status(200).json({
      code: 0,
      msg: '登录成功',
      data: {
        userId: session.id,
        nickname: session.nickname,
        avatar: session.avatar,
      },
    });
  } else {
    // 验证码错误
    res?.status(200).json({
      code: -1,
      msg: '验证码错误，登录失败',
    });
  }
}

export default withIronSessionApiRoute(login, ironOptions);
