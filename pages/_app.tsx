import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from 'components/layout';
import { StoreProvider } from 'store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider initValue={{ user: {} }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

export default MyApp;
