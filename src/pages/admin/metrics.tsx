/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import type { Data, Session, UserDocument, ViewDocument } from '@/lib/types';
import {
  fetchWithCookie,
  getSession,
  isAdmin,
} from '@/lib/Helpers/Methods/user';

import { useMetaData } from '@/hooks/useMetaData';
import { useRef, useState } from 'react';

import Layout from '@/components/Layout';
import Tabs from '@/components/Tabs';
import Toast, { ToastOptions } from '@/components/Toast';
import UserMetricsSection from '@/components/UserMetricsSection';
import ViewsMetricsSection from '@/components/ViewsMetricsSection';

interface Props {
  session: Session;
  users: UserDocument[];
  views: ViewDocument[] | null;
}

const metrics: NextPage<Props> = ({ session, users, views }) => {
  const usersRef = useRef<HTMLDivElement>(undefined!);
  const viewsRef = useRef<HTMLDivElement>(undefined!);
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });

  return (
    <>
      {useMetaData('Metrics', '/admin/metrics', 'Metrics page')}
      <Layout session={session}>
        <div className='container'>
          <h1 className='text-center text-5xl font-rubik font-bold mb-20 mt-20'>
            <span className='text-yellow-500 decoration-yellow-400 hover:underline cursor-pointer'>
              Power Gym{' '}
            </span>
            <span className='text-black hover:underline cursor-pointer'>
              Metrics
            </span>
          </h1>
          <Tabs
            items={[
              {
                name: 'Users',
                elementRef: usersRef,
              },
              {
                name: 'Views',
                elementRef: viewsRef,
              },
            ]}
            tw='flex flex-row items-center justify-center sm:block bg-gray-400 p-3 rounded-md'
          />
          <UserMetricsSection
            users={users}
            setMessage={setMessage}
            usersRef={usersRef}
          />
          <ViewsMetricsSection
            views={views}
            setMessage={setMessage}
            viewsRef={viewsRef}
          />
        </div>
      </Layout>
      {message.title !== '' && message.description !== '' && (
        <Toast data={message} />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const session = getSession(req);

  if (!session || !isAdmin(session)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const usersReq = await fetchWithCookie(
    req,
    `${process.env.NEXT_PUBLIC_URL}/api/u?search=all`,
  );
  const users = (await usersReq.json()) as Data<UserDocument[]>;

  const viewsReq = await fetchWithCookie(
    req,
    `${process.env.NEXT_PUBLIC_URL}/api/views?all=true`,
  );
  const views = (await viewsReq.json()) as Data<ViewDocument[] | null>;

  return {
    props: {
      session,
      users: users.data,
      views: views.data,
    },
  };
};

export default metrics;
