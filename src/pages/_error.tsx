/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import type { Session } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { getReasonPhrase } from 'http-status-codes';
import Layout from '@/components/Layout';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  statusCode: number;
  path: string;
  session: Session;
}

const ErrorPage: NextPage<Props> = ({ statusCode, path, session }) => {
  return (
    <>
      {useMetaData(
        getReasonPhrase(statusCode),
        path,
        `${statusCode} - ${getReasonPhrase(statusCode)}`,
      )}
      <Layout session={session}>
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-400 to-gray-500 mb-10 hover:rotate-3 transition-all duration-500 ease-in-out'>
            {statusCode} - {getReasonPhrase(statusCode)}
          </h1>
          <button
            className='text-lg bg-emerald-500 p-4 rounded-xl ring-4 ring-green-300 text-white font-semibold hover:-rotate-3 hover:scale-105 transition-all duration-500 ease-in-out focus:bg-green-600'
            onClick={(): void => window.history.back()}
          >
            Go back
          </button>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  resolvedUrl,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  const session = getSession(req);

  return {
    props: {
      statusCode: res.statusCode,
      path: resolvedUrl,
      session: session,
    },
  };
};

export default ErrorPage;
