/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Session, Data, CloudinaryApiResponse, UserRoles } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Toast, { ToastOptions, clearMessage } from '@/components/Toast';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
}

const Create: NextPage<Props> = ({ session }) => {
  const [message, setMessage] = useState<ToastOptions>({
    title: '',
    description: '',
    type: 'success',
  });
  const [title, setTitle] = useState('Taken at Power Gym');
  const [image, setImage] = useState<File>();
  const submitRef = useRef<HTMLButtonElement>(null);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.length !== 0) {
      setImage(e.target.files?.item(0) as File);
    }
  };
  const onTitleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setTitle(e.target.value);
  };

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    submitRef.current!.disabled = true;
    setMessage({
      type: 'loading',
      title: 'Uploading...',
      description: 'Uploading image to gallery',
    });
    const signatureRes = await fetch('/api/signature?folder=gallery');
    const {
      data: { signature, timestamp, key },
    } = (await signatureRes.json()) as {
      data: {
        signature: string;
        timestamp: number;
        key: string;
      };
    };
    const formData = new FormData();
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    formData.append('folder', 'power-gym/gallery');
    formData.append('api_key', key);
    formData.append('file', image!);
    formData.append('transformation', 'q_auto:good,f_auto,fl_lossy');

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    const cloudinaryData =
      (await cloudinaryRes.json()) as CloudinaryApiResponse;

    console.log('Size: %s Kb', cloudinaryData.bytes / 1000);

    if (cloudinaryRes.ok) {
      const galleryRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          url: cloudinaryData.secure_url,
          publicId: cloudinaryData.public_id,
          metaData: {
            width: cloudinaryData.width,
            height: cloudinaryData.height,
          },
        }),
      });
      const galleryData = (await galleryRes.json()) as Data;
      if (galleryRes.ok) {
        clearMessage(setMessage, 1000);
        setMessage({
          title: 'Success!',
          description: `Document was uploaded successfully to gallery.\nImage size: ${
            cloudinaryData.bytes / 1000
          } Kb`,
          type: 'success',
        });
        clearMessage(setMessage, 5000);
        setImage(undefined);
        setTitle('');
        return;
      }
      setMessage({
        title: 'Error!',
        description: galleryData.message,
        type: 'error',
      });
      clearMessage(setMessage, 5000);
    } else {
      setMessage({
        title: 'Error!',
        description: 'An error has occurred trying to upload image to cloud!',
        type: 'error',
      });
      clearMessage(setMessage, 5000);
    }
    setImage(undefined);
    setTitle('');
  };
  return (
    <>
      {useMetaData('Admin Gallery', '/admin/gallery/create')}
      <Layout session={session}>
        <div className='container text-center flex flex-col items-center justify-center'>
          <form
            onSubmit={onSubmit}
            className='flex flex-col items-center'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center bg-gray-300 p-5'>
              <div className='flex flex-col items-center bg-gradient-to-tr from-slate-600 to-amber-400 text-white rounded-2xl transition-all duration-300 ease-in-out p-10'>
                <Image
                  src={
                    image !== undefined
                      ? URL.createObjectURL(image)
                      : '/assets/icons/info.svg'
                  }
                  width='200'
                  height='200'
                  alt='preview'
                  className='mb-10'
                />
                <h1 className='font-bold text-xl'>{title}</h1>
              </div>
              <div className='flex flex-col items-center'>
                <input
                  onChange={onImageChange}
                  type='file'
                  accept='image/*'
                  className='bg-slate-400 text-white font-bold rounded-md m-0 p-0'
                />
                <label className='text-2xl font-bold mb-5'>Title</label>
                <textarea
                  className='text-center text-lg rounded-t-md border-2 border-slate-500 bg-gray-300 focus:outline-none text-gray-800 font-semibold mb-2
									resize
								'
                  minLength={10}
                  maxLength={50}
                  value={title}
                  onChange={onTitleChange}
                />
                {(title.length < 10 || title.length > 50) && (
                  <p className='text-red-400 text-md mb-8'>
                    Title should be between 10 and 50 characters long!
                  </p>
                )}
              </div>
            </div>
            <button
              type='submit'
              ref={submitRef}
              className='mt-7 bg-green-500 text-white font-bold text-xl px-10 py-4 rounded-xl ring-4 hover:rotate-2 hover:scale-90 hover:bg-emerald-600 focus:ring-yellow-400 focus:bg-amber-600 disabled:bg-gray-500 transition-all duration-300 ease-in'
              disabled={image === undefined || title.length < 10}
            >
              Upload
            </button>
          </form>
        </div>
        {message?.title !== '' && message?.description !== '' && (
          <Toast data={message!} />
        )}
      </Layout>
    </>
  );
};

export default Create;

export const getServerSideProps: GetServerSideProps = async ({
  req,
}: // eslint-disable-next-line require-await
GetServerSidePropsContext) => {
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

  return {
    props: {
      session: session,
    },
  };
};
