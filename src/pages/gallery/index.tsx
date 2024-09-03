/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSideProps,
} from 'next';
import {
  type Data,
  type Session,
  type GImageDocument,
  UserRoles,
} from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import GalleryImage from '@/components/GalleryImage';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
  images: GImageDocument[];
}

const Home: NextPage<Props> = ({ session, images }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (images) {
      setTimeout(() => {
        setLoading(false);
      }, 0.5 * 1000);
    }
  }, [images]);
  return (
    <>
      {useMetaData(
        'Gallery',
        '/gallery',
        'Checkout some amazing pictures of Power Gym!',
      )}
      <Layout
        session={session}
        active='gallery'
      >
        <h1 className='text-center text-5xl font-rubik font-bold mb-20'>
          <span className='text-yellow-500 decoration-yellow-400 hover:underline cursor-pointer'>
            Power Gym{' '}
          </span>
          <span className='text-black hover:underline cursor-pointer'>
            Gallery
          </span>
        </h1>
        <div className='container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center'>
          {images &&
            images.length > 0 &&
            (loading === false
              ? images?.map((image, i) => {
                  return (
                    <GalleryImage
                      key={i}
                      image={image}
                    />
                  );
                })
              : Array(10)
                  .fill(1)
                  .map((el, i) => {
                    return (
                      <div
                        key={i}
                        className='w-full h-80 bg-gray-300 rounded-lg shadow-lg animate-pulse'
                      ></div>
                    );
                  }))}
        </div>
        {images && images.length === 0 && (
          <div className='flex flew-col align-middle justify-center m-10'>
            <h1 className='text-3xl font-bold text-center'>
              There are no images at the moment.
            </h1>
            {session !== null && session.role >= UserRoles.ADMIN && (
              <button
                onClick={(): string =>
                  (window.location.href = '/admin/gallery/create')
                }
                className='p-4 bg-yellow-500 rounded-lg text-white font-semibold hover:-translate-y-3 transition-all duration-300 ease-in-out'
              >
                Add one
              </button>
            )}
          </div>
        )}
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
    `${process.env.NEXT_PUBLIC_URL}/api/gallery?all=true`,
  );
  const data = (await response.json()) as Data<GImageDocument[]>;

  return {
    props: {
      session: session,
      images: data.data,
    },
  };
};

export default Home;
