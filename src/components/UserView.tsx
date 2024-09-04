/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';
import { useState } from 'react';
import { Session, UserDocument, UserRoles, Data } from '@/lib/types';
import Toast, { ToastOptions, clearMessage } from './Toast';
import Modal from './Modal';
import { validatePass } from '@/pages/auth/register';

interface Props {
  session: Session;
  user: UserDocument;
}

export const getUserRole = (role: UserRoles): string => {
  return role === UserRoles.MEMBER
    ? 'Member'
    : role === UserRoles.ADMIN
    ? 'Admin'
    : role === UserRoles.OWNER
    ? 'Owner'
    : 'Developer';
};

const UserView: FC<Props> = ({ session, user }) => {
  const [visibleJson, setVisibleJson] = useState(false);
  const [role, setRole] = useState<number>(user.role);
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });
  const [disabled1, setDisabled1] = useState(false);
  const [disabled2, setDisabled2] = useState(false);

  const [password, setPassword] = useState('');

  const [show, setShow] = useState(false);

  const resetPassword = async (): Promise<void> => {
    setDisabled2(true);
    if (!validatePass(password)) {
      setMessage({
        type: 'error',
        title: 'Invalid password',
        description:
          'Password must be at least 8 characters long, contains upper case and lower case and special characters (%,/,@,1,2,3...) Example: p0wERgYm?Br0!',
      });
      clearMessage(setMessage, 4000);
      setDisabled2(false);
      setPassword('');
      return;
    }
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Resetting password',
    });
    const resp = await fetch('/api/admin/reset', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.userId,
        password,
      }),
    });
    const res = (await resp.json()) as Data;
    if (!resp.ok) {
      setMessage({
        type: 'error',
        title: 'Reset failed',
        description: res.message,
      });
      clearMessage(setMessage, 4000);
      setDisabled2(false);
      setPassword('');
      return;
    }
    setMessage({
      type: 'success',
      title: 'Reset successfully',
      description: 'The password was reset successfully',
    });
    clearMessage(setMessage, 4000);
    setDisabled2(false);
    setPassword('');
    return;
  };

  const deleteAccount = async (): Promise<void> => {
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Deleting account',
    });
    const response = await fetch('/api/admin/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: user.userId }),
    });
    const resp = (await response.json()) as Data;
    if (!response.ok) {
      setMessage({
        type: 'error',
        title: 'Failed to delete account',
        description: resp.message,
      });
      clearMessage(setMessage, 5000);
      return;
    }
    setMessage({
      type: 'success',
      title: 'Success',
      description: 'Account deleted successfully',
    });
    clearMessage(setMessage, 5000);
    setShow(false);
    window.location.href = '/admin';
    return;
  };

  // eslint-disable-next-line require-await
  const changeRole = async (): Promise<void> => {
    if (role === user.role) {
      setMessage({
        type: 'error',
        title: 'Error',
        description: 'User is already assigned that role',
      });
      clearMessage(setMessage, 5000);
      return;
    }
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: `Setting role to ${getUserRole(Number(role))}`,
    });
    const res = await fetch(`/api/u/${user.userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });
    const response = (await res.json()) as Data;
    clearMessage(setMessage);
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Role edited successfully!',
      });
      clearMessage(setMessage, 2500);
      setTimeout(() => window.location.reload(), 2500);
      return;
    }
    setMessage({
      type: 'error',
      title: 'Error',
      description: response.message,
    });
    clearMessage(setMessage, 10000);
    return;
  };

  const verify = async (): Promise<void> => {
    setMessage({
      type: 'loading',
      title: 'Loading',
      description: 'Verifying user...',
    });
    setDisabled1(true);
    clearMessage(setMessage, 2500);
    const response = await fetch('/api/admin/verify', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ id: user.userId }),
    });
    const res = (await response.json()) as Data<null>;
    if (res.error) {
      setMessage({
        type: 'error',
        title: 'Failed to verify',
        description: res.message,
      });
      clearMessage(setMessage, 2500);
      setDisabled1(false);
      return;
    }
    setMessage({
      type: 'success',
      title: 'Success',
      description: 'Verified successfully',
    });
    clearMessage(setMessage, 2500);
    setDisabled1(false);
    window.location.reload();
    return;
  };

  const unverify = async (): Promise<void> => {
    setMessage({
      type: 'loading',
      title: 'Loading',
      description: 'Unverifying user...',
    });
    setDisabled1(true);
    clearMessage(setMessage, 2500);
    const response = await fetch('/api/admin/unverify', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({ id: user.userId }),
    });
    const res = (await response.json()) as Data<null>;
    if (res.error) {
      setMessage({
        type: 'error',
        title: 'Failed to unverify',
        description: res.message,
      });
      clearMessage(setMessage, 2500);
      setDisabled1(false);
      return;
    }
    setMessage({
      type: 'success',
      title: 'Success',
      description: 'Unverified successfully',
    });
    setDisabled1(false);
    window.location.reload();
    clearMessage(setMessage, 2500);
    return;
  };

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <div className='w-screen h-28 sm:h-40 md:h-52 lg:h-64 bg-amber-400'></div>
        <div className='relative'>
          <img
            src={user.avatar}
            alt='avatar'
            width='75'
            height='75'
            className='-mt-9 bg-white rounded-full'
          />
        </div>
        <p className='mt-3 font-semibold text-xl'>{user.name}</p>
        <p className='mt-2 text-md text-gray-400'>ID: {user.userId}</p>
        <p
          className='mt-2 text-sm text-gray-400'
          suppressHydrationWarning
        >
          Created at:{' '}
          {new Date(user.createdAt)
            .toISOString()
            .slice(0, 10)
            .split('-')
            .reverse()
            .join('/')}{' '}
          (DD/MM/YYYY)
        </p>
        <p className='mt-3 text-md text-stone-800 font-medium'>
          Role: {getUserRole(user.role)}
        </p>
        {session &&
          (session.userId === user.userId ||
            session.role >= UserRoles.ADMIN) && (
            <div className='text-center'>
              <p className='mt-2 text-md text-gray-600 font-semibold'>
                Email: {user.email}
              </p>
              <p className='mt-2 text-md text-gray-600 font-semibold'>
                Phone Number: {user.phoneNumber}
              </p>
              <p className='mt-4 text-sm text-slate-700 font-bold'>
                NOTE: only you and website admins can see the information above.
              </p>
            </div>
          )}
        {session &&
          session.role >= UserRoles.ADMIN &&
          (session.role > user.role || session.role >= UserRoles.OWNER) && (
            <>
              <hr className='border-2 w-screen mt-10' />
              <div className='mt-10 flex flex-col items-center justify-center'>
                <h1 className='text-center text-2xl text-black font-bold mb-5'>
                  Admin area
                </h1>
                <p className='text-slate-600 font-semibold text-lg'>
                  Verification status:{' '}
                  <span
                    className={`${
                      user.verified ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {user.verified ? 'true' : 'false'}
                  </span>
                </p>
                <button
                  className={`my-4 py-4 px-6 text-white text-lg rounded-lg font-bold hover:translate-x-2 transition-all duration-500 ease-linear border-4 border-slate-200 ${
                    user.verified ? 'bg-red-600' : 'bg-green-600'
                  }`}
                  onClick={async (): Promise<void> => {
                    user.verified ? await unverify() : await verify();
                  }}
                  disabled={disabled1}
                >
                  {user.verified ? 'Unverify' : 'Verify'}
                </button>
                <p className='text-slate-700 font-semibold text-xl'>
                  Reset password
                </p>
                <input
                  type='text'
                  placeholder='Password'
                  value={password}
                  onChange={(e): void => setPassword(e.target.value)}
                  min={8}
                  className='w-64 mt-4 bg-transparent text-black focus:outline-none p-2 border-b-2 border-solid'
                  required
                />
                <button
                  className='my-4 py-4 px-6 disabled:bg-gray-500 disabled:cursor-not-allowed bg-green-500 text-white text-lg rounded-lg font-bold hover:translate-x-2 transition-all duration-500 ease-linear border-4 border-slate-200'
                  onClick={resetPassword}
                  disabled={disabled2}
                >
                  Reset
                </button>
                <button
                  className='p-4 my-4 hover:translate-y-2 transition-all duration-500 ease-out bg-red-600 text-white font-bold text-xl rounded-lg border-2 border-red-300'
                  onClick={(): void => setShow(true)}
                >
                  Delete account
                </button>
                <Modal
                  show={show}
                  setShow={setShow}
                  title={`Are you sure you want to delete ${user.name}'s account?`}
                  tw='flex flex-row'
                >
                  <button
                    className='text-white text-semibold text-lg bg-red-600 rounded-lg ring-2 p-3 inline-block align-middle mr-3'
                    onClick={(): void => setShow(false)}
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
              </div>
            </>
          )}
        {session && session.role >= UserRoles.OWNER && (
          <>
            <hr className='border-2 w-screen mt-10' />
            <div className='mt-10'>
              <h1 className='text-center text-2xl text-black font-bold mb-5'>
                Developer area
              </h1>
              <div className='flex flex-col items-center justify-center'>
                <button
                  onClick={(): void => setVisibleJson(!visibleJson)}
                  className='p-4 mb-5 bg-gray-600 text-white font-medium text-xl rounded-lg ring-4 hover:scale-90 transition-all duration-500 delay-100 ease-in-out'
                >
                  JSON
                </button>
                <div className={visibleJson ? 'block' : 'hidden'}>
                  {'{'}
                  {Object.entries(user).map(([key, value], i) => {
                    return (
                      <div
                        className='ml-5'
                        key={i}
                      >
                        <span className='text-cyan-500'>"{key}":</span>
                        <span className='text-yellow-600'>
                          {String(value)},
                        </span>
                      </div>
                    );
                  })}
                  {'}'}
                </div>
                <div className='flex flex-col space-y-5 sm:flex-row items-center space-x-5 h-auto mt-5'>
                  <p className='text-2xl font-bold'>Set role to: </p>
                  <select
                    className='text-xl '
                    onChange={(e): void => {
                      setRole(Number(e.target.value));
                    }}
                    defaultValue={role}
                  >
                    <option value='0'>Member</option>
                    <option value='1'>Admin</option>
                    <option value='2'>Owner</option>
                    <option value='3'>Developer</option>
                  </select>
                  <button
                    onClick={changeRole}
                    className='p-4 bg-green-600 text-white font-medium text-xl rounded-lg ring-4 hover:scale-90 transition-all duration-500 delay-100 ease-in-out'
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {message.title !== '' && message.description !== '' && (
        <Toast data={message} />
      )}
    </>
  );
};

export default UserView;
