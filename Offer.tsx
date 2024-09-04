/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';
import { IOffer, OfferDocument } from '@/lib/types';

interface Props {
  offer: IOffer | OfferDocument;
  loading?: boolean;
  href?: string;
}

const Offer: FC<Props> = ({ offer, loading, href }) => {
  return (
    <div
      onClick={href ? (): string => (window.location.href = href) : undefined}
      className={`cursor-pointer mb-10 w-full bg-no-repeat bg-center flex flex-col items-start p-20 rounded-2xl bg-cover text-black border-2 hover:scale-105 transition-all duration-500 ease-in-out ${
        loading ? 'animate-pulse h-96' : 'h-auto bg-gray-300'
      }`}
      style={{ backgroundImage: `${loading ? '' : `url(${offer.image})`}` }}
    >
      {!loading ? (
        <>
          <div className='bg-gray-400 bg-opacity-50 p-8'>
            <h1 className='text-3xl font-bold hover:translate-x-4 transition-all duration-300 ease-in-out mb-3 text-center sm:text-start'>
              {offer.title}
            </h1>
            <p className='text-xl font-semibold mb-4 text-center sm:text-start'>
              {offer.description}
            </p>
            <div className='flex flex-col sm:flex-row font-semibold mb-10 items-center mx-auto sm:mx-0 text-white text-stroke'>
              <p className='mr-2'>From: </p>
              <p
                suppressHydrationWarning
                className='w-auto h-auto p-2 rounded-lg font-bold bg-gradient-to-r from-amber-400 to-violet-600 cursor-pointer hover:scale-90 transition-all duration-500 ease-linear'
              >
                {new Date(offer.startsAt).toLocaleDateString()}{' '}
                {new Date(offer.startsAt).toLocaleTimeString()}
              </p>
            </div>
            <div className='flex flex-col sm:flex-row font-semibold items-center mx-auto sm:mx-0 text-white text-stroke'>
              <p className='mr-2'>To: </p>
              <p
                suppressHydrationWarning
                className='w-auto h-auto p-2 rounded-lg font-bold bg-gradient-to-r from-amber-400 to-violet-600 cursor-pointer hover:scale-90 transition-all duration-500 ease-linear'
              >
                {new Date(offer.endsAt).toLocaleDateString()}{' '}
                {new Date(offer.endsAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Offer;
