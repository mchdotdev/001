/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, OfferDocument, Session, UserRoles } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Offer from '@/components/Offer';
import { getSession } from '@/lib/Helpers/Methods/user';
import { useView } from '@/hooks/useView';

interface Props {
  session: Session;
  offers: OfferDocument[];
}

const Home: NextPage<Props> = ({ session, offers }) => {
  const [loading, setLoading] = useState(true);
  useView('/offers');
  useEffect(() => {
    if (offers) {
      setTimeout(() => {
        setLoading(false);
      }, 0.5 * 1000);
    }
  }, [offers]);
  return (
    <>
      {useMetaData(
        'Offers',
        '/offers',
        'Checkout the amazing offers at Power Gym.',
      )}
      <Layout
        session={session}
        active='offers'
      >
        <div className='container'>
          <h1 className='text-center text-5xl font-rubik font-bold mb-20'>
            <span className='text-yellow-500 decoration-yellow-400 hover:underline cursor-pointer'>
              Power Gym{' '}
            </span>
            <span className='text-black hover:underline cursor-pointer'>
              Offers
            </span>
          </h1>
          <div>
            {offers && offers.length > 0 && loading === false
              ? offers.map((offer, i) => {
                  return (
                    <Offer
                      offer={offer satisfies OfferDocument}
                      loading={loading}
                      key={i}
                      href={`/offers/${offer._id}`}
                    />
                  );
                })
              : Array(5)
                  .fill(1)
                  .map((el, i) => {
                    return (
                      <div
                        key={i}
                        className='w-full h-80 bg-gray-300 mb-5 rounded-lg shadow-lg animate-pulse'
                      ></div>
                    );
                  })}
          </div>
          {offers.length === 0 && (
            <div className='flex flew-row align-middle justify-center m-10'>
              <h1 className='text-3xl font-bold text-center'>
                There are no offers at the moment.
              </h1>
              {session !== null && session.role >= UserRoles.ADMIN && (
                <button
                  onClick={(): string =>
                    (window.location.href = '/admin/offers/create')
                  }
                  className='p-4 bg-yellow-500 rounded-lg text-white font-semibold hover:-translate-y-3 transition-all duration-300 ease-in-out'
                >
                  Create one
                </button>
              )}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${10 * 60}, stale-while-revalidate=59`,
  );
  const session = getSession(req);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/offers?page=0&limit=10`,
  );
  const offersRes = (await response.json()) as Data<OfferDocument[]>;

  return {
    props: {
      session: session,
      offers: offersRes.data,
    },
  };
};

export default Home;
