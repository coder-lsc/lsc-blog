import { format } from 'date-fns';
import { encode } from 'js-base64';
import md5 from 'md5';
import { NextApiRequest, NextApiResponse } from 'next';
import request from 'service/fetch';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from '..';

async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const  session: ISession = req.session;

  const { to = '', templateId = '1' } = req.body;

  // http://doc.yuntongxun.com/pe/5a533de33b8496dd00dce07c 容联云短信开发
  const appId = '2c9488768658b82f018679b2d41e0a6d';
  const AccountId = '2c9488768658b82f018679b2d2d80a66';
  const AuthToken = '13a56e94f6034941861ec553b6c642b3';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);

  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = '5';

  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await request.post(
    url,
    {
      // 手机号
      to,
      // 模板id 短信默认为1
      templateId,
      // 注册容联云账号有唯一appId
      appId,
      // 传入 验证码 和 过期时间 用于模板赋值 看容联云文档
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    },
  );

  console.log(response);

  const { statusCode, statusMsg, templateSMS } = response as any;
  if (statusCode === '000000') {
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
      code: 0,
      msg: statusMsg,
      data: {
        templateSMS,
      },
    });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    });
  }
}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);
