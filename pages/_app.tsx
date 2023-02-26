import '../styles/globals.css';
import Layout from 'components/layout';
import { StoreProvider } from 'store';
import { NextPage } from 'next';

interface IProps {
  initValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}

function MyApp({ initValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initValue={initValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  console.log(111, ctx?.req.cookies);

  const { userId, nickname, avatar } = ctx?.req.cookies || {};

  return {
    initValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar, 
        },
      },
    },
  };
};

export default MyApp;
