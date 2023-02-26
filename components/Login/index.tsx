import { message } from 'antd';
import CountDown from 'components/CountDown';
import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import request from 'service/fetch';
import { useStore } from 'store';

interface IProp {
  isShow: boolean;
  onClose: Function;
}

const Login = ({ isShow, onClose }: IProp) => {
  const store = useStore();
  console.log(store, '000');

  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });
  const [isShowVerifyCode, setIsShowVeriftyCode] = useState(false);
  const handleClose = () => {
    onClose && onClose();
  };
  const getVerifyCode = () => {
    // setIsShowVeriftyCode(true);
    if (!form?.phone) {
      message.warning('请输入手机号');
      return;
    }
    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
        templateId: 1,
      })
      .then((res: any) => {
        console.log(res);
        if (res?.code === 0) {
          setIsShowVeriftyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  const clickLogin = () => {
    request
      .post('/api/user/login', {
        phone: form.phone,
        verify: form.verify,
        indentity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          // 登录成功
          store.user.setUserInfo(res?.data);
          onClose && onClose();
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  const handleOAuth = () => {};
  const handleCountEnd = () => {
    setIsShowVeriftyCode(false);
  };
  const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  if (!isShow) return null;
  return (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登录</div>
          <div className={styles.closeIcon} onClick={handleClose}>
            x
          </div>
        </div>
        <input
          name="phone"
          placeholder="请输入手机号"
          className={styles.inputPhone}
          value={form.phone}
          onChange={changeInput}
        />
        <div className={styles.verifyCodeArea}>
          <input
            name="verify"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={changeInput}
          />
          <span className={styles.verify} onClick={getVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountEnd} />
            ) : (
              '获取验证码 '
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={clickLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuth}>
          使用github登录
        </div>
        <div className={styles.tips}>登录即可评论博客</div>
      </div>
    </div>
  );
};

export default Login;
