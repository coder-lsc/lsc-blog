import { NextPage } from 'next';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
import { ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

const Layout: NextPage<IProp> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
