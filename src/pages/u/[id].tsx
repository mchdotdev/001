/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, UserDocument, Session } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import Layout from '@/components/Layout';
import UserView from '@/components/UserView';
import NotFound from '@/components/NotFound';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
  user: UserDocument | null;
  message: string;
  path: string;
}

const Home: NextPage<Props> = ({ session, user, path, message }) => {
  if (user === null)
    return (
      <NotFound
        session={session}
        path={path}
        error={message}
      />
    );
  return (
    <>
      {useMetaData(user.name, path, `${user.name}'s Profile`)}
      <Layout session={session}>
        <UserView
          session={session}
          user={user}
        />
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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/u/${params!.id}`,
  );
  const userRes = (await response.json()) as Data<UserDocument>;

  return {
    props: {
      session: session,
      user: !userRes.error ? userRes.data : null,
      message: userRes.message,
      path: resolvedUrl,
    },
  };
};

export default Home;
