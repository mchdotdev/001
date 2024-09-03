/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-useless-escape */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, Session } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import Toast, { clearMessage, ToastOptions } from '@/components/Toast';

interface Input {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface Props {
  session: Session;
}

export const validatePass = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!password.match(/[A-Z]/g) || password.match(/[A-Z]/g)?.length === 0)
    return false;
  if (!password.match(/\d/g) || password.match(/\d/g)?.length === 0)
    return false;
  if (!password.match(/\W/g) || password.match(/\W/g)?.length === 0)
    return false;
  return true;
};

const Register: NextPage<Props> = ({ session }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });
  const [isVisible, setIsVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [emailSent, setEmailSent] = useState('');
  const [message, setMessage] = useState<ToastOptions>({
    title: '',
    description: '',
    type: 'info',
  });

  const onSubmit = async (data: Input): Promise<void> => {
    setDisabled(true);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resp = (await res.json()) as Data;
    if (res.ok) {
      setEmailSent(
        `You will find a verification email at ${data.email[0]}${'*'.repeat(
          data.email.split('@')[0].length - 1,
        )}${data.email.split('@')[1]}`,
      );
      setMessage({
        type: 'success',
        title: 'Successfully registered!',
        description: `You will find a verification email at ${
          data.email[0]
        }${'*'.repeat(data.email.split('@')[0].length - 1)}${
          data.email.split('@')[1]
        }`,
      });
      clearMessage(setMessage, 5000);
    } else {
      setMessage({
        type: 'error',
        title: 'An error has occurred!',
        description: `${resp.message}`,
      });
      clearMessage(setMessage);
      setDisabled(false);
    }
  };

  return (
    <>
      {useMetaData('Register', '/auth/register', 'Create an account.')}
      <Layout session={session}>
        <div className='container flex flex-col items-center justify-center'>
          <div className='bg-slate-200 p-5 rounded-lg shadow-lg'>
            <h1 className='text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 pb-8'>
              Create a Power Gym account
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col items-center justify-center'
            >
              <div className='pb-5'>
                <input
                  type='text'
                  placeholder='Full Name'
                  min={8}
                  className={`w-64 bg-transparent text-black focus:outline-none p-2 border-b-2 border-solid ${
                    errors.name ? 'border-b-red-600' : 'border-b-gray-600'
                  }`}
                  required
                  {...register('name', {
                    required: true,
                    pattern: /^[a-zA-Z+\s]+$/g,
                    minLength: 8,
                  })}
                />
                {errors.name && (
                  <p className='text-red-600 w-64'>
                    Please input a valid name that's at least 8 characters long.
                  </p>
                )}
              </div>
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
                  type='text'
                  placeholder='Phone number'
                  min={8}
                  className={`w-64 bg-transparent text-black focus:outline-none p-2 border-b-2 border-solid ${
                    errors.phoneNumber
                      ? 'border-b-red-600'
                      : 'border-b-gray-600'
                  }`}
                  required
                  {...register('phoneNumber', {
                    required: true,
                    pattern:
                      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g,
                  })}
                />
                {errors.phoneNumber && (
                  <p className='text-red-600 w-64'>
                    Please use a valid phone number.
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
                    validate: validatePass,
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
                    Password must be at least 8 characters long, contains upper
                    case and lower case and special characters{' '}
                    {'(%,/,@,1,2,3...)'}
                    Example: p0wERgYm?Br0!
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
                Already have an account?{' '}
                <Link
                  href={'/auth/login'}
                  className='text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to bg-yellow-500 font-bold text-lg'
                >
                  Login
                </Link>
              </p>
              {emailSent !== '' && (
                <p className='mt-5 text-lg font-bold'>{emailSent}</p>
              )}
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

export default Register;
