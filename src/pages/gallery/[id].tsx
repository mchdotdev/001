/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSideProps,
} from 'next';
import type { Data, Session, GImageDocument } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import Layout from '@/components/Layout';
import GalleryImageView from '@/components/GalleryImageView';
import NotFound from '@/components/NotFound';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
  image: GImageDocument | null;
  message: string;
  path: string;
  suggestedImages: GImageDocument[];
}

const Home: NextPage<Props> = ({
  session,
  image,
  suggestedImages,
  message,
  path,
}) => {
  if (image === null)
    return (
      <NotFound
        session={session}
        error={message}
        path={path}
      />
    );
  return (
    <>
      {useMetaData('Gallery', `/gallery/${image._id}`, image.title)}
      <Layout session={session}>
        <div className='container'>
          <GalleryImageView
            image={image}
            session={session}
            suggestedImages={suggestedImages}
          />
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
  resolvedUrl,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${10 * 60}, stale-while-revalidate=59`,
  );

  const session = getSession(req);

  const image = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/gallery/${params?.id}`,
  );
  const imageData = (await image.json()) as Data<GImageDocument>;

  const suggestedImages = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/gallery?limit=3&random=true`,
  );
  const suggestedData = (await suggestedImages.json()) as Data<
    GImageDocument[]
  >;

  return {
    props: {
      session: session,
      image: !imageData.error ? imageData.data : null,
      message: imageData.message,
      path: resolvedUrl,
      suggestedImages: suggestedData.data,
    },
  };
};

export default Home;
