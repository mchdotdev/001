/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, PostDocument, Session, UserRoles } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { ChangeEvent, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import IconButton from '@/components/IconButton';
import Toast, { ToastOptions, clearMessage } from '@/components/Toast';
import Post from '@/components/Post';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
  posts: PostDocument[];
}

const Home: NextPage<Props> = ({ session, posts }) => {
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<PostDocument[]>();
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (posts) {
      setTimeout(() => {
        setLoading(false);
      }, 0.5 * 1000);
    }
  }, [posts]);

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  const onSearch = async (): Promise<void> => {
    setMessage({
      type: 'loading',
      title: 'Searching...',
      description: 'Searching for related posts',
    });
    clearMessage(setMessage, 5000);
    const res = await fetch(`/api/posts?search=${query}`);
    const response = (await res.json()) as Data<PostDocument[]>;
    if (res.ok && response.data!.length > 0) {
      setFound(response.data);
      setQuery('');
      return;
    }
    setMessage({
      type: 'info',
      title: 'No related posts found',
      description: 'Could not find any related posts',
    });
    clearMessage(setMessage, 5000);
    setQuery('');
    return;
  };

  return (
    <>
      {useMetaData(
        'Blogs',
        '/blogs',
        'Checkout some blogs written by our admins!',
      )}
      <Layout
        session={session}
        active='blogs'
      >
        <div className='container'>
          <h1 className='text-center text-5xl font-rubik font-bold mb-20'>
            <span className='text-yellow-500 decoration-yellow-400 hover:underline cursor-pointer'>
              Power Gym{' '}
            </span>
            <span className='text-black hover:underline cursor-pointer'>
              Blogs
            </span>
          </h1>
          {posts.length > 0 ? (
            <>
              <h1 className='text-xl font-bold mb-2 mt-2'>Search for blogs</h1>
              <div className='flex flex-row items-center p-2 mx-auto'>
                <input
                  type='text'
                  className='w-96 h-10 pl-2 focus:outline-none border-2 rounded-tl-lg rounded-bl-lg'
                  onChange={onQueryChange}
                  value={query}
                />
                <IconButton
                  icon='search'
                  onClick={onSearch}
                  className='h-10 w-12 disabled:cursor-default disabled:bg-gray-500 cursor-pointer bg-green-500 rounded-tr-lg rounded-br-lg'
                  disabled={query.length === 0}
                ></IconButton>
              </div>
              {found && found?.length > 0 && (
                <h1 className='font-bold text-2xl mb-5'>Results</h1>
              )}
              <div
                className={`${
                  found && found.length > 0 ? 'block' : 'hidden'
                } grid gap-4 grid-cols-1 md:grid-cols-3 place-items-center mb-20`}
              >
                {found?.map((post, i) => {
                  return (
                    <Post
                      key={i}
                      post={post}
                    />
                  );
                })}
              </div>
              <h1 className='text-2xl font-bold mb-5'>Read now</h1>
              <div className='grid gap-4 grid-cols-1 md:grid-cols-3 place-items-center'>
                {posts && loading === false
                  ? posts.map((post, i) => {
                      return (
                        <Post
                          key={i}
                          post={post}
                        />
                      );
                    })
                  : Array(4)
                      .fill(1)
                      .map((el, i) => {
                        return (
                          <div
                            key={i}
                            className='w-[330px] h-[228px] bg-gray-300 mb-5 rounded-lg shadow-lg animate-pulse'
                          ></div>
                        );
                      })}
              </div>
            </>
          ) : (
            <div className='flex flew-row align-middle justify-center m-10'>
              <h1 className='text-3xl font-bold text-center'>
                There are no blogs at the moment.
              </h1>
              {session !== null && session.role >= UserRoles.ADMIN && (
                <button
                  onClick={(): string =>
                    (window.location.href = '/admin/blogs/create')
                  }
                  className='p-4 bg-yellow-500 rounded-lg text-white font-semibold hover:-translate-y-3 transition-all duration-300 ease-in-out'
                >
                  Write one
                </button>
              )}
            </div>
          )}
        </div>
      </Layout>
      {message.title !== '' && message.description !== '' && (
        <Toast data={message} />
      )}
    </>
  );
};

export default Home;

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

  const postReq = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/posts?page=0&limit=10`,
  );
  const posts = (await postReq.json()) as Data<PostDocument[]>;

  return {
    props: {
      session: session,
      posts: posts.data,
    },
  };
};
