/* eslint-disable @typescript-eslint/indent */
import { FC, useState } from 'react';
import { Data, PostDocument, Session, UserRoles } from '@/lib/types';
import { marked } from 'marked';
import Image from 'next/image';
import IconButton from './IconButton';
import Toast, { ToastOptions, clearMessage } from './Toast';
import Modal from './Modal';
import sanitizeHtml from 'sanitize-html';

const isAdmin = (session: Session): boolean => {
  return session !== null && session.role >= UserRoles.ADMIN;
};

interface Props {
  post: PostDocument;
  session: Session;
}

const PostView: FC<Props> = ({ post, session }) => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });
  const [edited, setEdited] = useState<{ title: string; markdown: string }>({
    title: post.title,
    markdown: post.markdown,
  });

  const editPost = async (): Promise<void> => {
    setMessage({
      type: 'loading',
      title: 'Editing....',
      description: 'Editing post',
    });
    const res = await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(edited),
    });
    const response = (await res.json()) as Data;
    clearMessage(setMessage);
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Post edited successfully',
      });
      clearMessage(setMessage, 4000);
      setTimeout(() => window.location.reload(), 4001);
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

  // eslint-disable-next-line require-await
  const deletePost = async (): Promise<void> => {
    setMessage({
      type: 'loading',
      title: 'Loading....',
      description: 'deleting post',
    });
    const res = await fetch(`/api/posts/${post._id}`, {
      method: 'DELETE',
    });
    const response = (await res.json()) as Data;
    clearMessage(setMessage);
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Post deleted successfully',
      });
      clearMessage(setMessage, 4000);
      setTimeout(() => (window.location.href = '/blogs'), 4001);
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

  return (
    <>
      <div className='flex flex-col space-y-5'>
        <div className='border-b-2 border-x-2 border-gray-300 mb-10'>
          <div
            style={{
              backgroundImage: `url(${post.coverUrl})`,
              backgroundSize: '100%',
            }}
            className='w-full bg-no-repeat bg-center h-24 sm:h-32 md:h-64 mx-auto'
          ></div>
          <h1 className='text-3xl font-bold font-rubik mt-4 p-3'>
            {post.title}
          </h1>
          <div className='flex flex-row items-center space-x-3 p-3'>
            <p className='font-bold text-xl p-3'>By: </p>
            <div
              onClick={(): string =>
                (window.location.href = `/u/${post.author}`)
              }
              className='cursor-pointer flex flex-row items-center space-x-2'
            >
              <Image
                alt='avatar'
                src='/assets/icons/user.svg'
                width={50}
                height={50}
                className='rounded-full'
              />
              <p className='text-md w-32 font-semibold text-gray-400'>
                {post.author}
              </p>
            </div>
          </div>
          <div className='px-5'>
            <p className='text-slate-500 text-lg'>
              Created at:{' '}
              <span className='underline decoration-slate-600'>
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className='text-slate-500 text-lg'>
              Last modified at:{' '}
              <span className='underline decoration-slate-600'>
                {new Date(post.lastModified).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(
              marked.parse(post.markdown, { mangle: false }),
            ),
          }}
          className='blog container'
        ></div>
        {session && session.role >= UserRoles.ADMIN && (
          <div className='mt-10 flex flex-row items-center justify-center space-x-10'>
            {isAdmin(session) && (
              <IconButton
                icon='edit'
                title='Edit post'
                className='bg-slate-400 w-10 h-10 rounded-lg'
                onClick={(): void => setShow1(true)}
              />
            )}
            <IconButton
              icon='delete'
              title='Delete post'
              className='bg-red-400 w-10 h-10 rounded-lg'
              onClick={(): void => setShow2(true)}
            />
          </div>
        )}
      </div>
      <Modal
        show={show1}
        setShow={setShow1}
        title='Edit post'
      >
        <div className='flex flex-col mb-10 font-semibold'>
          <label className='text-xl font-bold mb-3'>Title</label>
          <textarea
            minLength={10}
            maxLength={100}
            className='w-64 pt-1 pl-1 resize'
            rows={7}
            value={edited.title}
            onChange={(e): void =>
              setEdited({ ...edited, title: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col mb-10 font-semibold'>
          <label className='text-xl font-bold mb-3'>Markdown</label>
          <textarea
            className='resize pt-1 pl-1 w-80'
            rows={7}
            value={edited.markdown}
            onChange={(e): void =>
              setEdited({
                ...edited,
                markdown: e.target.value,
              })
            }
          />
        </div>
        <button
          onClick={editPost}
          disabled={
            edited.title.length < 10 ||
            edited.title.length > 100 ||
            edited.markdown.length === 0
          }
          className='p-3 px-5 rounded-lg bg-green-500 text-white font-semibold text-lg ring-2 ring-emerald-300 disabled:bg-gray-400 disabled:ring-gray-700 hover:scale-90 transition-all duration-300 ease-out'
        >
          Edit
        </button>
      </Modal>
      <Modal
        title='Are you sure you want to delete this post?'
        show={show2}
        setShow={setShow2}
      >
        <button
          className='text-white text-semibold text-lg bg-red-600 rounded-lg ring-2 p-3 inline-block align-middle mr-3'
          onClick={(): void => setShow2(false)}
        >
          Cancel
        </button>
        <button
          className='text-white text-semibold text-lg bg-green-600 rounded-lg ring-2 p-3 inline-block align-middle'
          onClick={deletePost}
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

export default PostView;
