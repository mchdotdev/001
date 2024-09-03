/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, GImageDocument, Session, UserRoles } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useState, ChangeEvent, useEffect } from 'react';
import { throttle } from '@/lib/Helpers/Methods/throttle';
import { marked } from 'marked';
import Layout from '@/components/Layout';
import ImagePicker from '@/components/ImagePicker';
import Image from 'next/image';
import Toast, { ToastOptions, clearMessage } from '@/components/Toast';
import { getSession } from '@/lib/Helpers/Methods/user';
import sanitizeHtml from 'sanitize-html';

interface Props {
  session: Session;
  images: string[];
}

interface Input {
  title: string;
  coverUrl: string;
  markdown: string;
}

const Create: NextPage<Props> = ({ session, images }) => {
  const [image, setImage] = useState<string>('');
  const [input, setInput] = useState<Input>({
    title: '',
    markdown: '',
    coverUrl: image,
  });
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });

  useEffect(() => {
    setImage(
      images.length > 0
        ? images[Math.floor(Math.random() * images.length)]
        : '',
    );
  }, []);

  const onTitleChange = throttle((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput({ ...input, title: e.target.value });
  }, 2500);

  const onMarkdownChange = throttle((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput({
      ...input,
      markdown: e.target.value,
    });
  }, 2500);

  useEffect(() => {
    setInput({ ...input, coverUrl: image });
  }, [image]);

  // eslint-disable-next-line require-await
  const handleSubmit = async (
    e: ChangeEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setMessage({
      type: 'loading',
      title: 'Uploading...',
      description: 'Creating blog post',
    });
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    const response = (await res.json()) as Data;
    clearMessage(setMessage, 4000);
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Blog post created successfully',
      });
      setInput({ title: '', coverUrl: image, markdown: '' });
      clearMessage(setMessage, 5000);
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
      {useMetaData('Admin blogs', '/admin/blogs/create')}
      <Layout session={session}>
        <div className='container'>
          <form
            className='flex flex-col p-5 space-y-5'
            onSubmit={handleSubmit}
          >
            <label className='text-xl font-bold'>Select a cover image:</label>
            <ImagePicker
              image={image}
              setImage={setImage}
              images={images}
              tw=''
            />
            <label className='text-xl font-bold my-2'>Title:</label>
            <textarea
              onChange={onTitleChange}
              placeholder='Title'
              className='bg-transparent focus:bg-gray-200 focus:outline-none border-b-2 border-gray-300 p-2 w-full shadow-xl'
              rows={1}
              minLength={10}
              maxLength={1000}
            ></textarea>
            <label className='text-xl font-bold my-2'>
              Markdown:{' '}
              <a
                href='https://www.markdownguide.org/cheat-sheet/'
                rel='noopener noreferrer'
                target='_blank'
                className='font-medium text-cyan-400 hover:underline decoration-cyan-300'
              >
                Cheat sheet
              </a>
            </label>
            <textarea
              onChange={onMarkdownChange}
              placeholder='Content'
              rows={10}
              className='bg-transparent focus:bg-gray-200 focus:outline-none border-b-2 border-gray-300 p-2 resize shadow-xl'
            ></textarea>
            <button
              type='submit'
              disabled={input.title.length < 10 || input.markdown.length === 0}
              className='p-5 w-fit mx-auto rounded-lg mt-10 text-center text-white font-bold text-md bg-green-500 ring-2 ring-cyan-300 disabled:bg-gray-400 cursor-pointer hover:scale-90 transition-all duration-300 ease-out'
            >
              Submit
            </button>
          </form>
          {input.title !== '' && (
            <div className='flex flex-col space-y-5 mt-20'>
              <h1 className='text-2xl font-bold text-yellow-400'>Preview</h1>
              <div className='border-b-2 border-x-2 border-gray-300 mb-10'>
                <div
                  style={{
                    backgroundImage: `url(${input.coverUrl})`,
                    backgroundSize: '100%',
                  }}
                  className='w-full bg-no-repeat bg-center h-24 sm:h-32 md:h-44 mx-auto'
                ></div>
                <h1 className='text-3xl font-bold font-rubik mt-4 p-3'>
                  {input.title}
                </h1>
                <div className='flex flex-row items-center space-x-3 p-3'>
                  <p className='font-bold text-xl p-3'>By: </p>
                  <Image
                    alt='avatar'
                    src={session!.avatar}
                    width={50}
                    height={50}
                    className='rounded-full'
                  />
                  <p className='text-md font-semibold text-gray-400'>
                    {session!.name}
                  </p>
                </div>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  __html: sanitizeHtml(
                    marked.parse(input.markdown, { mangle: false }),
                  ),
                }}
                className='blog'
              ></div>
            </div>
          )}
        </div>
      </Layout>
      {message.title !== '' && message.description !== '' && (
        <Toast data={message} />
      )}
    </>
  );
};

export default Create;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${10 * 60}, stale-while-revalidate=59`,
  );
  const session = getSession(req);

  if (
    session === null ||
    (session !== null && session.role < UserRoles.ADMIN)
  ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/gallery?all=true`,
  );
  const galleryRes = (await response.json()) as Data<GImageDocument[]>;
  const images = galleryRes.data?.map((img) => img.url);

  return {
    props: {
      session: session,
      images: images,
    },
  };
};
