/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import type { Data, GImageDocument, OfferDocument, Session } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useCountdown } from '@/hooks/useCountdown';
import { useOnMobile } from '@/hooks/useOnMobile';
import Layout from '@/components/Layout';
import Carousel from '@/components/Carousel';
import AOS from '@/components/AOS';
import Image from 'next/image';
import ReviewCard, { Review } from '@/components/ReviewCard';
import { getSession } from '@/lib/Helpers/Methods/user';
import Link from 'next/link';
import { useView } from '@/hooks/useView';

interface Props {
  session: Session;
  images: GImageDocument[] | null;
  offer: OfferDocument | null;
  mobile: boolean;
}

const reviews: Review[] = [
  {
    avatar:
      'https://lh3.googleusercontent.com/a-/AD_cMMSUwkalxh81_85MTQ3jkaXCdM9pyB79GNKSknZ1Knws2DY=w36-h36-p-rp-mo-br100',
    name: 'Marwane siani',
    text: 'Best gym',
  },
  {
    avatar:
      'https://lh3.googleusercontent.com/a/AAcHTtd_lNlQMm2QiAmVwfePsLe1r6cbcnYHvFz5SAWo7KAm=w36-h36-p-rp-mo-br100',
    name: 'Jared Tormey Micheal',
    text: 'one of the best gyms',
  },
  {
    avatar:
      'https://lh3.googleusercontent.com/a-/AD_cMMT2Ej_wQKBfhv4_Fab-PQaOWL0FWwB6F1k7AW6bBBcVIKQ=w36-h36-p-rp-mo-br100',
    name: 'Reda Sk',
    text: 'Best gym ever 👌🏻👌🏻',
  },
];

const formatCountdown = (
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
): string => {
  return `${days} day${days > 1 || days === 0 ? 's' : ''}, ${hours} hour${
    hours > 1 || hours === 0 ? 's' : ''
  }, ${minutes} minute${minutes > 1 || minutes === 0 ? 's' : ''} 
			and ${seconds} second${seconds > 1 || seconds === 0 ? 's' : ''}`;
};

const Home: NextPage<Props> = ({ session, images, mobile, offer }) => {
  const onMobile = useOnMobile() === null ? mobile : useOnMobile();
  const time = useCountdown(offer !== null ? offer.endsAt : 0);
  useView('/');

  return (
    <>
      {useMetaData('Home', '', 'Home Page')}
      <Layout session={session}>
        {offer !== null && (
          <div
            onClick={(): string =>
              (window.location.href = `/offers/${offer._id}`)
            }
            style={{
              backgroundImage: `url(${offer.image})`,
              backgroundSize: '100%',
            }}
            className='cursor-pointer w-full bg-no-repeat bg-center h-56 flex flex-col items-center justify-center'
          >
            <h1 className='text-xl md:text-2xl text-center font-bold text-white text-stroke'>
              {offer.title}
            </h1>
            <p
              suppressHydrationWarning
              className='text-center font-bold text-lg sm:text-xl text-white text-stroke bg-gray-300 p-1 sm:p-3 mt-4 backdrop-blur-sm bg-opacity-60'
            >
              {time.every((t) => t === 0)
                ? 'Loading'
                : time[0] < 1000
                ? 'Expired!'
                : `Hurry up, there are only ${formatCountdown(
                    time![1],
                    time![2],
                    time![3],
                    time![4],
                  )} left on our latest offer!`}
            </p>
            <Link
              href={`/offers/${offer._id}`}
              className='text-center font-bold text-lg text-white text-stroke mt-5 cursor-pointer bg-slate-900 p-2 rounded-md hover:translate-y-1 transition-all duration-500 ease-in-out'
            >
              Click to find more
            </Link>
          </div>
        )}
        <div className='container'>
          <h1 className='text-center text-5xl font-rubik font-bold mb-20'>
            <span className='text-yellow-500 decoration-yellow-400 hover:underline cursor-pointer'>
              Power{' '}
            </span>
            <span className='text-black hover:underline cursor-pointer'>
              Gym
            </span>
          </h1>
          <AOS dir='lr'>
            <div className='flex flex-row items-center justify-between bg-amber-600 text-white p-10 rounded-xl mb-20'>
              <p className='text-xl font-bold w-1/2'>
                Welcome to our gym! Here, we are committed to helping you reach
                your fitness goals in a supportive and motivating environment.
              </p>
              {images !== null && (
                <Image
                  src={images[0].url}
                  width={
                    !onMobile
                      ? images[0].metaData.width / 3
                      : images[0].metaData.width / 5
                  }
                  height={
                    !onMobile
                      ? images[0].metaData.height / 3
                      : images[0].metaData.height / 4
                  }
                  alt={images[0].title}
                />
              )}
            </div>
          </AOS>
          <AOS dir='rl'>
            <div className='flex flex-row items-center justify-between bg-yellow-600 text-white p-10 rounded-xl mb-20'>
              <p className='text-xl font-bold w-1/2'>
                Whether you've just starting your fitness journey or looking to
                take your workouts to the next level.
              </p>
              {images !== null && (
                <Image
                  src={images[images.length > 1 ? 1 : 0].url}
                  width={
                    !onMobile
                      ? images[images.length > 1 ? 1 : 0].metaData.width / 3
                      : images[images.length > 1 ? 1 : 0].metaData.width / 5
                  }
                  height={
                    !onMobile
                      ? images[images.length > 1 ? 1 : 0].metaData.height / 3
                      : images[images.length > 1 ? 1 : 0].metaData.height / 4
                  }
                  alt={images[images.length > 1 ? 1 : 0].title}
                />
              )}
            </div>
          </AOS>
          {images !== null && (
            <>
              <h1 className='text-center text-3xl font-rubik font-bold mb-20'>
                Have a look at your new favorite place!
              </h1>
              <AOS
                dir='tb'
                tw='mb-20'
              >
                <Carousel
                  images={images.map((img) => img.url)}
                  tw='bg-amber-400 rounded-xl'
                />
              </AOS>
            </>
          )}
          <h1 className='text-center text-3xl font-rubik font-bold mb-20'>
            Not convinced yet? Checkout some of our reviews!
          </h1>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 place-items-center space-y-3 sm:space-y-0'>
            {reviews.map((review, i) => {
              return (
                <ReviewCard
                  avatar={review.avatar}
                  name={review.name}
                  text={review.text}
                  key={i}
                />
              );
            })}
          </div>
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

  const gResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/gallery?page=0&limit=8`,
  );
  const galleryRes = (await gResponse.json()) as Data<GImageDocument[]>;

  const oResponse = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/offers?page=0&limit=1`,
  );
  const offerRes = (await oResponse.json()) as Data<OfferDocument[]>;

  const expired =
    offerRes.data?.length !== 0 && offerRes.data![0].endsAt - Date.now() < 0;

  return {
    props: {
      session: session,
      images: galleryRes.data?.length !== 0 ? galleryRes.data : null,
      offer: !expired ? offerRes.data![0] : null,
      mobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          req.headers['user-agent']!,
        ),
    },
  };
};

export default Home;
