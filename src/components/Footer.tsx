/* eslint-disable @typescript-eslint/indent */
import { FC, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: FC = () => {
  const [hidden, setHidden] = useState(true);
  return (
    <footer className='h-auto'>
      <svg
        id='visual'
        viewBox='0 0 900 200'
        className='-mb-2'
        version='1.1'
      >
        <path
          d='M0 8L21.5 36.2C43 64.3 86 120.7 128.8 123.5C171.7 126.3 214.3 75.7 257.2 67C300 58.3 343 91.7 385.8 108.8C428.7 126 471.3 127 514.2 124.8C557 122.7 600 117.3 642.8 108.3C685.7 99.3 728.3 86.7 771.2 77C814 67.3 857 60.7 878.5 57.3L900 54L900 201L878.5 201C857 201 814 201 771.2 201C728.3 201 685.7 201 642.8 201C600 201 557 201 514.2 201C471.3 201 428.7 201 385.8 201C343 201 300 201 257.2 201C214.3 201 171.7 201 128.8 201C86 201 43 201 21.5 201L0 201Z'
          fill='#FACC15'
          strokeLinecap='round'
          strokeLinejoin='miter'
        ></path>
      </svg>
      <div className='bg-yellow-400 p-3 text-black'>
        <div>
          <h1 className='text-center text-2xl font-bold sm:text-3xl'>
            Location
          </h1>
          <div className='flex flex-row items-center justify-center space-x-6 pt-10 text-center'>
            <p
              className='p-3 cursor-pointer animate-bounce rounded-md bg-pink-600 text-4xl font-bold text-white'
              onClick={() => setHidden(!hidden)}
            >
              {hidden ? 'Show' : 'Hide'}
            </p>
          </div>
          <div className='flex items-center justify-center pb-10'>
            <iframe
              src={process.env.NEXT_PUBLIC_GML}
              className={`m-3 h-[150px] w-screen p-3 sm:h-[200px] md:h-[300px] ${
                hidden ? 'hidden' : ''
              }`}
              style={{ border: '0' }}
              allowFullScreen={false}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>
        </div>
        <hr className='border-gray-600 pb-10' />
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 p-5 place-items-start'>
          <Link href={'/'}>
            <Image
              src={'/assets/logo.png'}
              alt='logo'
              width='100'
              height='100'
              className='rounded-full bg-white'
            />
          </Link>
          <div>
            <h1 className='text-xl font-bold'>Links</h1>
            <div className='flex flex-col text-pink-600 font-semibold text-lg'>
              <p
                onClick={(): string => (window.location.href = '/blogs')}
                className='cursor-pointer hover:border-b-8 hover:border-b-pink-500 decoration-pink-400'
              >
                Blogs
              </p>
              <p
                onClick={(): string => (window.location.href = '/gallery')}
                className='cursor-pointer hover:border-b-8 hover:border-b-pink-500 decoration-pink-400'
              >
                Gallery
              </p>
              <p
                onClick={(): string => (window.location.href = '/offers')}
                className='cursor-pointer hover:border-b-8 hover:border-b-pink-500 decoration-pink-400'
              >
                Offers
              </p>
            </div>
          </div>
          <div>
            <h1 className='text-xl font-bold'>Follow Us</h1>
            <div className='flex flex-row items-center justify-center space-x-2'>
              <a
                href='/instagram'
                target='blank'
                rel='noopener noreferrer'
              >
                <svg
                  width={30}
                  height={30}
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='cursor-pointer'
                >
                  <g
                    id='SVGRepo_bgCarrier'
                    strokeWidth='0'
                  ></g>
                  <g
                    id='SVGRepo_tracerCarrier'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></g>
                  <g id='SVGRepo_iconCarrier'>
                    {' '}
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z'
                      fill='#000000'
                    ></path>{' '}
                    <path
                      d='M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z'
                      fill='#000000'
                    ></path>{' '}
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z'
                      fill='#000000'
                    ></path>{' '}
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <hr className='border-gray-600 pb-10' />
        <p className='text-center font-bold text-lg pb-10'>
          &copy; Copyright 2023 | Power Gym &#46; All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
