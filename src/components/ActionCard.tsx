/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';

export interface AdminAction {
  name: string;
  route: string;
}

interface Props {
  action: AdminAction;
}

const ActionCard: FC<Props> = ({ action }) => {
  return (
    <>
      <div
        className='w-1/2 relative cursor-pointer rounded-3xl bg-gradient-to-r from-orange-500 to-yellow-600 p-10 text-center text-2xl font-semibold text-white transition-all duration-500 ease-in-out hover:translate-y-1 hover:scale-90'
        onClick={(): string =>
          (window.location.href = `/admin/${action.route}`)
        }
      >
        <div className='absolute w-full h-10 bg-orange-300 rounded-t-3xl top-0 left-0'></div>
        <div className='absolute w-14 h-14 bg-yellow-400 rounded-tr-full left-0 bottom-5'></div>
        <p className='z-50 p-10'>{action.name}</p>
        <div className='absolute w-14 h-14 bg-yellow-400 rounded-bl-full right-0 top-10'></div>
        <div className='absolute w-full h-10 bg-orange-500 rounded-b-3xl bottom-0 left-0'></div>
      </div>
    </>
  );
};

export default ActionCard;
