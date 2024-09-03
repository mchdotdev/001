/* eslint-disable @typescript-eslint/indent */
import { FC, ReactNode } from 'react';
import type { Session } from '../lib/types';
import Footer from './Footer';
import Navbar from './Navbar';

interface Props {
  children: ReactNode;
  session: Session;
  active?: 'gallery' | 'offers' | 'blogs';
}

const Layout: FC<Props> = ({ children, session, active }) => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar
        session={session}
        active={active}
      />
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
