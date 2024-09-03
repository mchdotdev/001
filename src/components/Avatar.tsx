/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';

interface Props {
  name: string;
  tw?: string;
}

const Avatar: FC<Props> = ({ name, tw }) => {
  const splitted = name.split(' ');
  return (
    <p
      className={`text-slate-600 bg-gray-300 text-lg font-semibold py-2 w-12 h-12 rounded-full backdrop-blur-sm shadow-lg ${tw}`}
      title={name}
    >
      {(splitted.length >= 2
        ? splitted[0][0] + splitted[1][0]
        : splitted[0]
      ).toUpperCase()}
    </p>
  );
};

export default Avatar;
