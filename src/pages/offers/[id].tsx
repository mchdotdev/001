/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, OfferDocument, Session } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import Layout from '@/components/Layout';
import OfferView from '@/components/OfferView';
import NotFound from '@/components/NotFound';
import { getSession } from '@/lib/Helpers/Methods/user';
import { useView } from '@/hooks/useView';

interface Props {
  session: Session;
  offer: OfferDocument | null;
  message: string;
  path: string;
}

const Home: NextPage<Props> = ({ session, offer, path, message }) => {
  if (offer === null)
    return (
      <NotFound
        session={session}
        path={path}
        error={message}
      />
    );
  useView(path);
  return (
    <>
      {useMetaData('Offers', `/offers/${offer._id}`, offer.title)}
      <Layout session={session}>
        <div className='container'>
          <OfferView
            session={session}
            offer={offer}
          />
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  resolvedUrl,
  res,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${10 * 60}, stale-while-revalidate=59`,
  );
  const session = getSession(req);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/offers/${params!.id}`,
  );
  const offerRes = (await response.json()) as Data<OfferDocument>;

  return {
    props: {
      session: session,
      offer: !offerRes.error ? offerRes.data : null,
      message: offerRes.message,
      path: resolvedUrl,
    },
  };
};

export default Home;
