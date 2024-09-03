/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Session, UserRoles } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import Layout from '@/components/Layout';
import ActionCard, { AdminAction } from '@/components/ActionCard';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
}

const actions: AdminAction[] = [
  {
    name: 'Add a new image to the gallery',
    route: 'gallery/create',
  },
  {
    name: 'Create a new offer',
    route: 'offers/create',
  },
  {
    name: 'Write a new blog post',
    route: 'blogs/create',
  },
  {
    name: 'Check out the metrics',
    route: 'metrics',
  },
];

const Home: NextPage<Props> = ({ session }) => {
  return (
    <>
      {useMetaData('Admin', '/admin')}
      <Layout session={session}>
        <div className='container'>
          <h1
            className='text-xl font-bold text-center sm:text-start'
            suppressHydrationWarning
          >
            {new Date().getHours() < 12
              ? 'Good morning, '
              : new Date().getHours() < 18
              ? 'Good afternoon, '
              : 'Good evening, '}{' '}
            {session?.name}.
          </h1>
          <h1 className='text-2xl font-semibold mt-5 mb-10 text-center sm:text-start bg-orange-500 text-white p-2 w-fit h-fit rounded-md'>
            Actions:
          </h1>
          <div className='flex flex-col items-center justify-center space-y-3'>
            {actions.map((action, i) => {
              return (
                <ActionCard
                  key={i}
                  action={action}
                />
              );
            })}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({
  req,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  const session = getSession(req);

  if (
    session === null ||
    (session !== null && session.role < UserRoles.ADMIN)
  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: session,
    },
  };
};
