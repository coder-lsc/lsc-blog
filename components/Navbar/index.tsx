import { Button } from 'antd';
import Login from 'components/Login';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { navs } from './config';
import styles from './index.module.scss';

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const goToEditorPage = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>罗思成的前端学习日志</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link
            key={nav?.label}
            href={nav?.value}
            className={pathname === nav?.value ? styles.active : ''}
          >
            {nav?.label}
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={goToEditorPage}>写文章</Button>
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
