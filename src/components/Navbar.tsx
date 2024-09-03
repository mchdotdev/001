/* eslint-disable @typescript-eslint/indent */
import { FC, useState } from 'react';
import { Session } from '@/lib/types';
import { UserRoles } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import Dropdown from './Dropdown';
import Avatar from './Avatar';

interface Props {
  session: Session;
  active?: 'gallery' | 'offers' | 'blogs';
}

interface Page {
  name: string;
  url: string;
}

const mobilePages: Page[] = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Gallery',
    url: '/gallery',
  },
  {
    name: 'Offers',
    url: '/offers',
  },
  {
    name: 'Blogs',
    url: '/blogs',
  },
];

const Navbar: FC<Props> = ({ session, active }) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className='mb-10'>
      <nav className='flex flex-row items-center justify-around p-2 bg-yellow-400 sm:bg-transparent sm:backdrop-blur-md drop-shadow-lg sm:sticky top-0 text-black z-10'>
        <div>
          <Link href={'/'}>
            <Image
              src={'/assets/logo.png'}
              alt='logo'
              width='75'
              height='75'
              className='bg-white rounded-full'
              priority
            />
          </Link>
        </div>
        <div className='hidden space-x-2 font-bold text-lg sm:flex sm:flex-row'>
          <p
            onClick={(): string => (window.location.href = '/')}
            className='cursor-pointer transition-all hover:scale-90 duration-300 ease-in-out'
          >
            Home
          </p>
          <p
            onClick={(): string => (window.location.href = '/gallery')}
            className={`${
              active === 'gallery' ? 'text-yellow-400' : 'text-black'
            } cursor-pointer hover:text-yellow-400 transition-all hover:scale-90 duration-300 ease-in-out`}
          >
            Gallery
          </p>
          <p
            onClick={(): string => (window.location.href = '/offers')}
            className={`${
              active === 'offers' ? 'text-cyan-500' : 'text-black'
            } cursor-pointer hover:text-cyan-500 transition-all hover:scale-90 duration-300 ease-in-out`}
          >
            Offers
          </p>
          <p
            onClick={(): string => (window.location.href = '/blogs')}
            className={`${
              active === 'blogs' ? 'text-pink-600' : 'text-black'
            } cursor-pointer hover:text-pink-600 transition-all hover:scale-90 duration-300 ease-in-out`}
          >
            Blogs
          </p>
        </div>
        {session === null ? (
          <p
            onClick={(): string => (window.location.href = '/auth/login')}
            className='hidden sm:block text-lg font-bold cursor-pointer hover:translate-x-2 transition-all duration-300 ease-in'
          >
            Login ➡️
          </p>
        ) : session !== null && session?.role < UserRoles.ADMIN ? (
          <Dropdown
            items={[
              {
                text: 'Profile',
                href: `/u/${session.userId}`,
              },
              {
                text: 'Dashboard',
                href: '/dashboard',
              },
              {
                text: 'Logout',
                href: '/api/auth/logout',
              },
            ]}
            direction='bottom'
            tw='hidden sm:block border-2 border-black shadow-lg w-32'
          >
            <Avatar
              name={session.name}
              tw='hidden sm:block'
            />
            {/* <Image
              title={session?.name}
              src={session?.avatar}
              alt='avatar'
              width='30'
              height='30'
              className='hidden sm:block cursor-pointer'
            /> */}
          </Dropdown>
        ) : (
          <Dropdown
            items={[
              {
                text: 'Admin',
                href: '/admin',
              },
              {
                text: 'Profile',
                href: `/u/${session.userId}`,
              },
              {
                text: 'Dashboard',
                href: '/dashboard',
              },
              {
                text: 'Logout',
                href: '/api/auth/logout',
              },
            ]}
            direction='bottom'
            tw='hidden sm:block border-2 border-black shadow-lg w-32'
          >
            <Avatar
              name={session.name}
              tw='hidden sm:block'
            />
            {/* <Image
              title={session.name}
              src={session.avatar}
              alt='avatar'
              width='30'
              height='30'
              className='hidden sm:block cursor-pointer'
            /> */}
          </Dropdown>
        )}
        <span
          className='block sm:hidden float-right cursor-pointer hover:scale-90 transition-all duration-300 ease-in-out'
          onClick={(): void => setShowMenu(!showMenu)}
        >
          <Image
            src='/assets/icons/hamburger.svg'
            width={35}
            height={35}
            alt='Menu'
            priority
          />
        </span>
      </nav>
      {showMenu && (
        <div className='flex flex-col items-center justify-center sm:hidden bg-gray-200 shadow-xl p-3 font-extrabold'>
          {mobilePages.map(({ name, url }, i) => {
            return (
              <h1
                className='cursor-pointer hover:underline transition-all duration-300 ease-in-out'
                onClick={(): string => (window.location.href = url)}
                key={i}
              >
                {name}
              </h1>
            );
          })}
          {session && session.role < UserRoles.ADMIN ? (
            <Dropdown
              direction='bottom'
              items={[
                {
                  text: 'Profile',
                  href: `/u/${session.userId}`,
                },
                {
                  text: 'Dashboard',
                  href: '/dashboard',
                },
                {
                  text: 'Log Out',
                  href: '/api/auth/logout',
                },
              ]}
              newSpace={false}
              tw='border-2 border-black -ml-5 w-32'
            >
              <span className='bg-clip-text text-transparent bg-gradient-to-t from-yellow-600 to-pink-600'>
                {session?.name}
              </span>
            </Dropdown>
          ) : session && session.role >= UserRoles.ADMIN ? (
            <Dropdown
              direction='bottom'
              items={[
                {
                  text: 'Admin',
                  href: '/admin',
                },
                {
                  text: 'Profile',
                  href: `/u/${session.userId}`,
                },
                {
                  text: 'Dashboard',
                  href: '/dashboard',
                },
                {
                  text: 'Log Out',
                  href: '/api/auth/logout',
                },
              ]}
              newSpace={false}
              tw='border-2 border-black -ml-5 w-32'
            >
              <span className='bg-clip-text text-transparent bg-gradient-to-t from-yellow-600 to-pink-600'>
                {session?.name}
              </span>
            </Dropdown>
          ) : (
            <h1
              className='cursor-pointer hover:underline transition-all duration-300 ease-in-out'
              onClick={(): string => (window.location.href = '/auth/login')}
            >
              Log in
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
