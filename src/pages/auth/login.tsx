/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-useless-escape */
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSideProps,
} from 'next';
import { useMetaData } from '@/hooks/useMetaData';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Layout from '@/components/Layout';
import Toast, { ToastOptions, clearMessage } from '@/components/Toast';
import Link from 'next/link';
import { Data, Session } from '@/lib/types';

interface Input {
  email: string;
  password: string;
}

interface Props {
  session: Session;
}

const Login: NextPage<Props> = ({ session }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Input>();
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });
  const [disabled, setDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const onSubmit = async (data: Input): Promise<void> => {
    setDisabled(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resp = (await res.json()) as Data<Session>;
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success',
        description: 'Logged in successfully!',
      });
      clearMessage(setMessage);
      window.location.href = '/';
      return;
    }
    setMessage({
      type: 'error',
      title: 'Error',
      description: resp.message,
    });
    clearMessage(setMessage);
    setDisabled(false);
  };

  return (
    <>
      {useMetaData('Login', '/auth/login', 'Login to your Power Gym account.')}
      <Layout session={session}>
        <div className='container flex flex-col items-center justify-center'>
          <div className='bg-slate-200 p-5 rounded-lg shadow-lg'>
            <h1 className='text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 pb-8'>
              Login to your Power Gym account
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col items-center justify-center'
            >
              <div className='pb-5'>
                <input
                  type='text'
                  placeholder='Email'
                  min={8}
                  className={`w-64 bg-transparent text-black focus:outline-none p-2 border-b-2 border-solid ${
                    errors.email ? 'border-b-red-600' : 'border-b-gray-600'
                  }`}
                  required
                  {...register('email', {
                    required: true,
                    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                  })}
                />
                {errors.email && (
                  <p className='text-red-600 w-64'>
                    Please use a valid email address.
                  </p>
                )}
              </div>
              <div className='pb-5'>
                <input
                  type={isVisible ? 'text' : 'password'}
                  placeholder='Password'
                  min={8}
                  className={`w-64 bg-transparent text-black focus:outline-none p-2 border-b-2 border-solid ${
                    errors.password ? 'border-b-red-600' : 'border-b-gray-600'
                  }`}
                  required
                  {...register('password', {
                    required: true,
                    minLength: 8,
                  })}
                />
                <span
                  className='-ml-6 cursor-pointer'
                  onClick={(): void => setIsVisible(!isVisible)}
                >
                  {isVisible ? '😑' : '👁'}
                </span>
                {errors.password && (
                  <p className='text-red-600 w-64'>
                    Please use a strong password that's at least 8 characters
                    long.
                  </p>
                )}
              </div>
              <button
                type='submit'
                className='mt-5 mb-10 w-36 h-10 bg-green-400 text-center text-white font-bold text-lg rounded-md hover:scale-90 hover:bg-yellow-400 focus:bg-pink-700 transition-all duration-300 ease-out disabled:bg-gray-500 disabled:cursor-not-allowed'
                disabled={disabled}
              >
                Submit
              </button>
              <p className='text-md'>
                Don't have an account?{' '}
                <Link
                  href={'/auth/register'}
                  className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to bg-yellow-500 font-bold text-lg'
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
        {message.title && message.description && <Toast data={message} />}
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  if (req.cookies[process.env.COOKIE_NAME]) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: null,
    },
  };
};

export default Login;
