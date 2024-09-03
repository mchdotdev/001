/* eslint-disable @typescript-eslint/indent */
import { SetStateAction, Dispatch, FC } from 'react';
import Image from 'next/image';

export interface ToastOptions {
  title: string;
  description: string;
  type: 'error' | 'success' | 'info' | 'loading';
}

interface Props {
  data: ToastOptions;
}

const Toast: FC<Props> = ({ data }) => {
  return (
    <div className='flex flex-row items-center justify-center'>
      <div
        className={`toast show min-w-[250px] max-w-[400px] break-word text-black rounded-2xl p-4 fixed z-50 bottom-8 shadow-md bg-white border-l-[10px] border-solid ${
          data.type === 'success'
            ? 'border-l-[#2cb216]'
            : data.type === 'error'
            ? 'border-l-[#d74343]'
            : data.type === 'info'
            ? 'border-l-[#43b3d7]'
            : 'border-l-l[#6472ea]'
        }`}
      >
        <h6 className='font-bold inline-block align-middle'>
          <div className='inline-block align-middle mr-2'>
            <Image
              src={'/assets/icons/' + data.type + '.svg'}
              alt='icon'
              width='25'
              height='25'
              className={data.type === 'loading' ? 'animate-spin' : ''}
            />
          </div>
          {data.title}
        </h6>
        <p>{data.description}</p>
      </div>
    </div>
  );
};

export const clearMessage = (
  setMessage: Dispatch<SetStateAction<ToastOptions>>,
  delay = 3000,
): void => {
  const reset = (): void =>
    setMessage({ type: 'info', title: '', description: '' });
  setTimeout(reset, delay);
};

export default Toast;
