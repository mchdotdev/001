/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, Session } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useState } from 'react';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import Toast, { ToastOptions, clearMessage } from '@/components/Toast';
import { getSession } from '@/lib/Helpers/Methods/user';
import { validatePass } from './auth/register';

interface Props {
  session: Session;
}

const Home: NextPage<Props> = ({ session }) => {
  if (session === null)
    return (
      <>
        {useMetaData('Dashboard', '/dashboard', 'Manage your account')}
        <Layout session={null}>
          <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-xl font-bold mb-10'>
              You must be logged in order to access the dashboard
            </h1>
            <button
              className='text-lg bg-emerald-500 p-4 rounded-xl ring-4 ring-green-300 text-white font-semibold hover:-rotate-3 hover:scale-105 transition-all duration-500 ease-in-out focus:bg-green-600'
              onClick={(): string => (window.location.href = '/auth/login')}
            >
              Login
            </button>
          </div>
        </Layout>
      </>
    );
  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [passwordData, setPasswordData] = useState<{
    oldPassword: string;
    newPassword: string;
  }>({
    oldPassword: '',
    newPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<
    'email' | 'name' | 'phoneNumber' | 'password' | 'none'
  >('none');
  const [showDelete, setShowDelete] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });

  // eslint-disable-next-line require-await
  const editName = async (): Promise<void> => {
    setIsSubmitting('name');
    if (name.length < 8 || name === session.name) {
      setMessage({
        type: 'error',
        title: 'Error',
        description:
          'New name has to be at least 8 characters long and different from your old name',
      });
      clearMessage(setMessage, 5000);
      setIsSubmitting('none');
      return;
    }
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Editing name',
    });
    const res = await fetch(`/api/u/${session.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name }),
    });
    const response = (await res.json()) as Data;
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Changed name successfully',
      });
      setIsSubmitting('none');
      clearMessage(setMessage, 5000);
      return;
    }
    setMessage({
      type: 'error',
      title: 'Error',
      description: response.message,
    });
    setIsSubmitting('none');
    clearMessage(setMessage, 5000);
    return;
  };

  const editEmail = async (): Promise<void> => {
    setIsSubmitting('email');
    if (
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) === false ||
      email.length === 0 ||
      email === session.email
    ) {
      setMessage({
        type: 'error',
        title: 'Error',
        description: 'Invalid email address',
      });
      clearMessage(setMessage, 5000);
      setIsSubmitting('none');
      return;
    }
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Editing email',
    });
    const res = await fetch(`/api/u/${session.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });
    const response = (await res.json()) as Data;
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Changed email successfully',
      });
      setIsSubmitting('none');
      clearMessage(setMessage, 5000);
      return;
    }
    setMessage({
      type: 'error',
      title: 'Error!',
      description: response.message,
    });
    setIsSubmitting('none');
    clearMessage(setMessage, 5000);
    return;
  };

  const editNumber = async (): Promise<void> => {
    setIsSubmitting('phoneNumber');
    if (
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(
        phoneNumber,
      ) === false ||
      phoneNumber.length === 0
    ) {
      setMessage({
        type: 'error',
        title: 'Error',
        description: 'Invalid phone number',
      });
      clearMessage(setMessage, 5000);
      setIsSubmitting('none');
      return;
    }
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Editing phone number',
    });
    const res = await fetch(`/api/u/${session.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber: phoneNumber }),
    });
    const response = (await res.json()) as Data;
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Changed phone number successfully',
      });
      setIsSubmitting('none');
      clearMessage(setMessage, 5000);
      return;
    }
    setMessage({
      type: 'error',
      title: 'Error!',
      description: response.message,
    });
    setIsSubmitting('none');
    clearMessage(setMessage, 5000);
    return;
  };

  const deleteAccount = async (): Promise<void> => {
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Deleting account',
    });
    const res = await fetch(`/api/u/${session.userId}`, {
      method: 'DELETE',
    });
    const response = (await res.json()) as Data;
    clearMessage(setMessage);
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Account deleted successfully',
      });
      clearMessage(setMessage, 4000);
      setTimeout(() => (window.location.href = '/'), 4001);
      return;
    }
    setMessage({
      type: 'error',
      title: 'Error!',
      description: response.message,
    });
    clearMessage(setMessage, 5000);
    return;
  };

  const editPassword = async (): Promise<void> => {
    setIsSubmitting('password');
    if (passwordData.oldPassword.length < 8) {
      setMessage({
        type: 'error',
        title: 'Invalid password',
        description:
          'Old password should be 8 characters long! Rewrite it again',
      });
      setIsSubmitting('none');
      clearMessage(setMessage, 5000);
      return;
    }
    if (
      passwordData.oldPassword.length >= 8 &&
      !validatePass(passwordData.newPassword)
    ) {
      setMessage({
        type: 'error',
        title: 'Invalid password',
        description:
          'Password must be at least 8 characters long, contains upper case and lower case and special characters (%,/,@,1,2,3...) Example: p0wERgYm?Br0!',
      });
      setIsSubmitting('none');
      clearMessage(setMessage, 5000);
      return;
    }
    setMessage({
      type: 'loading',
      title: 'Loading',
      description: 'Changing password...',
    });
    const res = await fetch(`/api/u/${session.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    const resp = (await res.json()) as Data;
    if (!res.ok) {
      setMessage({
        type: 'error',
        title: 'Error',
        description: resp.message,
      });
      clearMessage(setMessage, 5000);
      setIsSubmitting('none');
      setShowPasswordEdit(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
      });
      return;
    }
    setMessage({
      type: 'success',
      title: 'Success',
      description: resp.message,
    });
    clearMessage(setMessage, 5000);
    setIsSubmitting('none');
    setShowPasswordEdit(false);
    setPasswordData({
      oldPassword: '',
      newPassword: '',
    });
    return;
  };

  return (
    <>
      {useMetaData('Dashboard', '/dashboard', 'Manage your account')}
      <Layout session={session}>
        <div className='container flex flex-col space-y-5'>
          <h1
            className='text-xl font-bold text-center sm:text-start mb-10'
            suppressHydrationWarning
          >
            {new Date().getHours() < 12
              ? 'Good morning, '
              : new Date().getHours() < 18
              ? 'Good afternoon, '
              : 'Good evening, '}{' '}
            {session?.name}.
          </h1>
          <label className='font-semibold text-xl mb-3'>Name</label>
          <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e): void => setName(e.target.value)}
            minLength={8}
            className='focus:outline-none border-b-2 pl-2 w-64 h-12 text-lg'
          />
          <button
            onClick={editName}
            disabled={isSubmitting === 'name'}
            className='p-5 w-fit rounded-lg mt-10 text-center text-white font-bold text-md bg-green-500 ring-2 ring-cyan-300 disabled:bg-gray-400 cursor-pointer hover:scale-90 transition-all duration-300 ease-out'
          >
            Edit
          </button>
          <label className='font-semibold text-xl mb-3 mt-4'>Email</label>
          <input
            type='text'
            placeholder='Name'
            value={email}
            onChange={(e): void => setEmail(e.target.value)}
            minLength={8}
            className='focus:outline-none border-b-2 pl-2 w-64 h-12 text-lg'
          />
          <button
            onClick={editEmail}
            disabled={isSubmitting === 'email'}
            className='p-5 w-fit rounded-lg mt-10 text-center text-white font-bold text-md bg-green-500 ring-2 ring-cyan-300 disabled:bg-gray-400 cursor-pointer hover:scale-90 transition-all duration-300 ease-out'
          >
            Edit
          </button>
          <label className='font-semibold text-xl mb-3 mt-4'>
            Phone number
          </label>
          <input
            type='text'
            placeholder='Phone number'
            value={phoneNumber}
            onChange={(e): void => setPhoneNumber(e.target.value)}
            minLength={8}
            className='focus:outline-none border-b-2 pl-2 w-64 h-12 text-lg'
          />
          <button
            onClick={editNumber}
            disabled={isSubmitting === 'email'}
            className='p-5 w-fit rounded-lg mt-10 text-center text-white font-bold text-md bg-green-500 ring-2 ring-cyan-300 disabled:bg-gray-400 cursor-pointer hover:scale-90 transition-all duration-300 ease-out'
          >
            Edit
          </button>
          <button
            onClick={(): void => setShowPasswordEdit(true)}
            className='p-5 w-fit rounded-lg text-center text-white font-bold text-md bg-yellow-500 cursor-pointer hover:scale-90 transition-all duration-300 ease-out'
          >
            Change password
          </button>
          <button
            onClick={(): void => setShowDelete(true)}
            className='p-5 w-fit rounded-lg text-center text-white font-bold text-md bg-red-500 cursor-pointer hover:scale-90 transition-all duration-300 ease-out'
          >
            Delete account
          </button>
        </div>
      </Layout>
      <Modal
        title='Change your password'
        show={showPasswordEdit}
        setShow={setShowPasswordEdit}
        tw='flex flex-col space-y-2'
      >
        <label className='font-semibold text-xl mb-3 mt-4'>Old password</label>
        <input
          type='text'
          placeholder='Old password'
          value={passwordData.oldPassword}
          onChange={(e): void =>
            setPasswordData({
              ...passwordData,
              oldPassword: e.target.value,
            })
          }
          minLength={8}
          className='focus:outline-none border-b-2 pl-2 w-64 h-12 text-lg'
        />
        <label className='font-semibold text-xl mb-3 mt-4'>New password</label>
        <input
          type='text'
          placeholder='New password'
          value={passwordData.newPassword}
          onChange={(e): void =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
          minLength={8}
          className='focus:outline-none border-b-2 pl-2 w-64 h-12 text-lg'
        />
        <button
          onClick={editPassword}
          disabled={isSubmitting === 'password'}
          className='p-5 w-fit rounded-lg mt-10 text-center text-white font-bold text-md bg-green-500 ring-2 ring-cyan-300 disabled:bg-gray-400 cursor-pointer hover:scale-90 transition-all duration-300 ease-out'
        >
          Edit
        </button>
      </Modal>
      <Modal
        title='Are you sure you want to delete your account?'
        show={showDelete}
        setShow={setShowDelete}
      >
        <button
          className='text-white text-semibold text-lg bg-red-600 rounded-lg ring-2 p-3 inline-block align-middle mr-3'
          onClick={(): void => setShowDelete(false)}
        >
          Cancel
        </button>
        <button
          className='text-white text-semibold text-lg bg-green-600 rounded-lg ring-2 p-3 inline-block align-middle'
          onClick={deleteAccount}
        >
          Confirm
        </button>
      </Modal>
      {message.title !== '' && message.description !== '' && (
        <Toast data={message} />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  const session = getSession(req);

  return {
    props: {
      session: session,
    },
  };
};

export default Home;
