/* eslint-disable @typescript-eslint/indent */
import { UserDocument, UserRoles } from '@/lib/types';
import {
  FC,
  useState,
  MutableRefObject,
  ChangeEvent,
  Dispatch,
  SetStateAction,
} from 'react';
import { ToastOptions, clearMessage } from './Toast';

import IconButton from './IconButton';
import UserMetricsCard from './UserMetricsCard';

interface Props {
  users: UserDocument[];
  usersRef: MutableRefObject<HTMLDivElement>;
  setMessage: Dispatch<SetStateAction<ToastOptions>>;
}

const UserMetricsSection: FC<Props> = ({ users, usersRef, setMessage }) => {
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<UserDocument[]>(users);

  const [all, setAll] = useState(true);
  const [admins, setAdmins] = useState(false);
  const [verified, setVerified] = useState(false);
  const [unverified, setUnverified] = useState(false);

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  const onSearch = (): void => {
    const filtered = users.filter((u) => u.name.includes(query));
    if (filtered.length > 0) {
      setFound(filtered);
      setQuery('');
      return;
    }
    setMessage({
      type: 'info',
      title: 'No related accounts found',
      description: 'Could not find any related accounts',
    });
    clearMessage(setMessage, 5000);
    setQuery('');
    setFound(users);
    return;
  };

  const toggleAdmins = (): void => {
    setFound(users.filter((u) => u.role >= UserRoles.ADMIN));
    setAll(false);
    setAdmins(true);
  };

  const toggleAll = (): void => {
    setFound(users);
    setAll(true);
    setAdmins(false);
  };

  const toggleVerified = (): void => {
    if (all) {
      setFound(
        !unverified
          ? found.filter((u) => u.verified === true)
          : users.filter((u) => u.verified === true),
      );
      setVerified(true);
      setUnverified(false);
    }
  };

  const toggleUnverified = (): void => {
    if (all) {
      setFound(
        !verified
          ? found.filter((u) => u.verified === false)
          : users.filter((u) => u.verified === false),
      );
      setUnverified(true);
      setVerified(false);
    }
  };

  return (
    <div
      ref={usersRef}
      className='text-center sm:text-start mt-10'
    >
      <p className='font-semibold text-xl'>
        Total users: <span className='font-bold text-lg'>{users.length}</span>
      </p>
      <p className='font-semibold text-xl'>
        Total admins:{' '}
        <span className='font-bold text-lg'>
          {users.filter((u) => u.role > UserRoles.MEMBER).length}
        </span>
      </p>
      <p className='font-semibold text-xl'>
        Total members:{' '}
        <span className='font-bold text-lg'>
          {users.filter((u) => u.role === UserRoles.MEMBER).length}
        </span>
      </p>
      <h1 className='text-xl font-bold mb-2 mt-2'>Filter</h1>
      <div className='flex flex-col sm:flex-row items-center space-x-6'>
        <div className='flex flex-row items-center justify-center'>
          <input
            type='text'
            className='w-60 sm:w-96 h-10 focus:outline-none border-2 rounded-tl-lg rounded-bl-lg pl-2'
            onChange={onQueryChange}
            value={query}
            placeholder='Name'
          />
          <IconButton
            icon='search'
            onClick={onSearch}
            className='h-10 w-12 disabled:cursor-default disabled:bg-gray-500 cursor-pointer bg-green-500 rounded-tr-lg rounded-br-lg'
            disabled={query.length === 0}
          ></IconButton>
        </div>
        <div className='flex flex-row items-center space-x-6'>
          <div>
            <div className='space-x-1'>
              <input
                type='checkbox'
                name='all'
                id='all'
                checked={all}
                onChange={(): void => {
                  toggleAll();
                }}
              />
              <label
                htmlFor='admin'
                className='text-gray-500 font-bold'
              >
                All
              </label>
            </div>
            <div className='space-x-1'>
              <input
                type='checkbox'
                name='admin'
                id='admin'
                checked={admins}
                onChange={(): void => {
                  if (!admins) {
                    toggleAdmins();
                  } else {
                    toggleAll();
                  }
                }}
              />
              <label
                htmlFor='admin'
                className='text-yellow-500 font-bold'
              >
                Admins
              </label>
            </div>
          </div>
          <div>
            <div className='space-x-1'>
              <input
                type='checkbox'
                name='verified'
                id='verified'
                checked={verified}
                onChange={(): void => {
                  toggleVerified();
                }}
              />
              <label
                htmlFor='verified'
                className='text-green-500 font-bold'
              >
                Verified
              </label>
            </div>
            <div className='space-x-1'>
              <input
                type='checkbox'
                name='unverified'
                id='unverified'
                checked={unverified}
                onChange={(): void => {
                  toggleUnverified();
                }}
              />
              <label
                htmlFor='unverified'
                className='text-slate-600 font-bold'
              >
                Unverified
              </label>
            </div>
          </div>
        </div>
      </div>
      {found && found?.length > 0 && (
        <h1 className='font-bold text-2xl mb-5'>Results</h1>
      )}
      <div
        className={`${
          found && found.length > 0 ? 'block' : 'hidden'
        } grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center mt-10 mb-20`}
      >
        {found?.map((u, i) => {
          return (
            <UserMetricsCard
              user={u}
              key={i}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UserMetricsSection;
