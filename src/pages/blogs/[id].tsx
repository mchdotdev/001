/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, PostDocument, Session } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import Layout from '@/components/Layout';
import PostView from '@/components/PostView';
import NotFound from '@/components/NotFound';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
  post: PostDocument | null;
  message: string;
  path: string;
}

const Home: NextPage<Props> = ({ session, post, path, message }) => {
  if (post === null)
    return (
      <NotFound
        session={session}
        path={path}
        error={message}
      />
    );
  return (
    <>
      {useMetaData('Blogs', `/blogs/${post._id}`, post.title)}
      <Layout session={session}>
        <PostView
          post={post}
          session={session}
        />
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  resolvedUrl,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  const session = getSession(req);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/posts/${params!.id}`,
  );
  const postRes = (await response.json()) as Data<PostDocument>;

  return {
    props: {
      session: session,
      post: !postRes.error ? postRes.data : null,
      message: postRes.message,
      path: resolvedUrl,
    },
  };
};

export default Home;
