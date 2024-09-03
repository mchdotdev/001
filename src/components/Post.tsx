/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';
import type { PostDocument } from '@/lib/types';

interface Props {
  post: PostDocument;
}

const truncate = (text: string): string => {
  return text.length < 50 ? text : text.slice(0, 50) + '...';
};

const Post: FC<Props> = ({ post }) => {
  return (
    <div
      className='w-[330px] h-[228px] bg-gray-300 rounded-xl cursor-pointer hover:scale-110 transition-all duration-300 ease-in-out delay-100'
      onClick={(): string => (window.location.href = '/blogs/' + post._id)}
    >
      <div
        style={{ backgroundImage: `url(${post.coverUrl})` }}
        className='w-full h-28 bg-center rounded-t-xl border-b-2 border-black'
      ></div>
      <h1
        className='mr-2 ml-2 w-80 text-xl font-bold break-words pb-1'
        title={post.title}
      >
        {truncate(post.title)}
      </h1>
    </div>
  );
};

export default Post;
