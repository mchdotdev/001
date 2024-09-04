/* eslint-disable @typescript-eslint/indent */
import type { NextPage } from 'next';
import { useMetaData } from '@/hooks/useMetaData';
import Layout from '@/components/Layout';

const ErrorPage: NextPage = () => {
  return (
    <>
      {useMetaData('404 - Not found', '/404', '404 - Not found')}
      <Layout session={null}>
        <div className='flex flex-col items-center justify-center h-screen'>
          <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-400 to-gray-500 mb-10 hover:rotate-3 transition-all duration-500 ease-in-out'>
            404 - Not found
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

export default ErrorPage;
