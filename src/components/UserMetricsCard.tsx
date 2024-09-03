/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';
import { UserDocument, UserRoles } from '@/lib/types';
import Avatar from './Avatar';
import Dropdown from './Dropdown';

import { useOnMobile } from '@/hooks/useOnMobile';

import { truncate } from '@/lib/Helpers/Methods/truncate';

export const getRole = (role: UserRoles): string => {
  return role === UserRoles.MEMBER
    ? 'Member'
    : role === UserRoles.ADMIN
    ? 'Admin'
    : role === UserRoles.OWNER
    ? 'Owner'
    : 'Developer';
};

interface Props {
  user: UserDocument;
}

const UserMetricsCard: FC<Props> = ({ user }) => {
  const isMobile = useOnMobile();
  return (
    <Dropdown
      direction='bottom'
      newSpace={isMobile!}
      items={[
        {
          text: `name: ${user.name}`,
        },
        {
          text: `userId: ${user.userId}`,
        },
        {
          text: 'Visit',
          href: `/u/${user.userId}`,
          tw: 'font-bold underline',
        },
      ]}
    >
      <div
        className={`flex flex-col p-3 items-center shadow-lg w-56 cursor-pointer ${
          user.role === UserRoles.MEMBER ? 'bg-gray-400' : 'bg-yellow-300'
        }`}
        title='Click to expand'
      >
        <Avatar name={user.name} />
        <p
          className='font-bold text-lg text-center mb-3'
          title={user.name}
        >
          {truncate(user.name)}
        </p>
      </div>
    </Dropdown>
  );
};

export default UserMetricsCard;
