/* eslint-disable @typescript-eslint/indent */
import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from 'next';
import { Data, Session, GImageDocument, IOffer, UserRoles } from '@/lib/types';
import { useMetaData } from '@/hooks/useMetaData';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '@/components/Layout';
import ImagePicker from '@/components/ImagePicker';
import Offer from '@/components/Offer';
import Toast, { ToastOptions, clearMessage } from '@/components/Toast';
import Modal from '@/components/Modal';
import { getSession } from '@/lib/Helpers/Methods/user';

interface Props {
  session: Session;
  images: string[];
}

interface Input {
  title: string;
  description: string;
  image: string;
  startsAtDate: string;
  startsAtTime: string;
  endsAtDate: string;
  endsAtTime: string;
}

const validateStart = (s: string, e: string): boolean => {
  return new Date(s).getTime() - new Date(e).getTime() <= 0;
};

const validateEnd = (e: string, s: string): boolean => {
  return new Date(e).getTime() - new Date(s).getTime() >= 0;
};

const calcDate = (date: string, time: string): Date => {
  const [hours, minutes] = time.split(':');

  return new Date(
    new Date(date).getTime() +
      (Number(hours) - 1) * 60 * 60 * 1000 +
      Number(minutes) * 60 * 1000,
  );
};

const Create: NextPage<Props> = ({ session, images }) => {
  const handleUnload = (e: BeforeUnloadEvent): undefined | string => {
    if (isSubmitting) return undefined;

    const confirmationMessage =
      'You have unsaved changes.\nThey will be lost if you leave the page';
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  };

  const [image, setImage] = useState<string>(
    images[Math.floor(Math.random() * images.length)],
  );
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Input>({
    defaultValues: {
      title: 'Checkout this Power Gym offer!',
      description: 'Checkout this Power Gym offer!',
      image,
      startsAtDate: new Date().toLocaleDateString('en-CA'),
      endsAtDate: new Date().toLocaleDateString('en-CA'),
      startsAtTime: '00:00',
      endsAtTime: '00:00',
    },
  });
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });
  const [preview, setPreview] = useState<IOffer>();
  const [disabled, setDisabled] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const subscribe = watch((offer) => {
      setDisabled(
        offer?.endsAtDate === new Date().toLocaleDateString('en-CA') ||
          offer.title!.length < 10 ||
          offer.description!.length < 10 ||
          !validateStart(offer.startsAtDate!, offer.endsAtDate!) ||
          !validateEnd(offer.endsAtDate!, offer.startsAtDate!),
      );
    });

    return () => {
      subscribe.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    if (preview) {
      setPreview({ ...preview, image: image });
    }
  }, [image]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  const onSubmit = (
    data: Input,
    // eslint-disable-next-line require-await
  ): void => {
    setMessage({
      type: 'loading',
      title: 'Preparing preview',
      description: 'This will take a few moments',
    });
    setTimeout(() => {
      setPreview({
        title: data.title,
        description: data.description,
        image: data.image,
        startsAt: calcDate(data.startsAtDate, data.startsAtTime).getTime(),
        endsAt: calcDate(data.endsAtDate, data.endsAtTime).getTime(),
      });
    }, 3001);
    clearMessage(setMessage, 3000);
  };

  const createOffer = async (): Promise<void> => {
    setShow(false);
    setMessage({
      type: 'loading',
      title: 'Uploading...',
      description: 'Uploading offer',
    });
    console.log(preview);
    const res = await fetch('/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preview),
    });
    const response = (await res.json()) as Data;
    clearMessage(setMessage);
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Offer created!',
      });
      clearMessage(setMessage, 4000);
      return;
    }
    setMessage({
      type: 'error',
      title: 'Error!',
      description: response.message,
    });
    clearMessage(setMessage, 4000);
    return;
  };

  return (
    <>
      {useMetaData('Offers', '/admin/offers/create')}
      <Layout session={session}>
        <div className='container'>
          <div className='bg-gray-300 w-full h-auto rounded-lg p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 place-items-center mb-5'>
            <div>
              <label className='text-xl font-bold mb-3'>Select an image</label>
              <ImagePicker
                images={images}
                image={image}
                setImage={setImage}
              />
            </div>
            <form
              className='flex flex-col items-center md:items-start'
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className='text-xl font-bold mb-3'>Title</label>
              <textarea
                {...register('title', {
                  required: true,
                  minLength: 10,
                  maxLength: 50,
                })}
                minLength={10}
                maxLength={50}
                className={`resize border-2 border-gray-500 rounded-md px-2 bg-transparent focus:outline-none font-semibold mb-4 ${
                  errors.title ? 'border-red-600' : ''
                }`}
              />
              {errors.title && (
                <p className='text-red-500 w-52'>
                  'Title' should be between 10 and 50 characters in length.
                </p>
              )}
              <label className='text-xl font-bold mb-3'>Description</label>
              <textarea
                {...register('description', {
                  required: true,
                  minLength: 10,
                  maxLength: 100,
                })}
                minLength={10}
                maxLength={100}
                className={`resize border-2 border-gray-500 rounded-md px-2 bg-transparent focus:outline-none font-semibold mb-4 ${
                  errors.description ? 'border-red-600' : ''
                }`}
              />
              {errors.description && (
                <p className='text-red-500 w-52'>
                  'Description' should be between 10 and 100 characters in
                  length.
                </p>
              )}
              <input
                type='text'
                {...register('image', {
                  value: image,
                })}
                className='invisible'
              />
              <div className='space-x-5'>
                <label className='text-xl font-bold inline-block align-bottom'>
                  Start date:
                </label>
                <input
                  {...register('startsAtDate', {
                    required: true,
                    valueAsDate: false,
                  })}
                  defaultValue={new Date().toLocaleDateString('en-CA')}
                  className={`inline-block align-middle ${
                    errors.startsAtDate ? 'outline-red-600' : ''
                  }`}
                  type='date'
                />
                {errors.startsAtDate && (
                  <p className='text-red-500 w-52'>Please select a date.</p>
                )}
                <input
                  {...register('startsAtTime', {
                    required: true,
                  })}
                  defaultValue={'00:00'}
                  className={`inline-block align-middle ${
                    errors.startsAtTime ? 'outline-red-600' : ''
                  }`}
                  type='time'
                />
                {errors.startsAtTime && (
                  <p className='text-red-500 w-52'>Please select a Time.</p>
                )}
              </div>
              <div className='space-x-8'>
                <label className='text-xl font-bold inline-block align-bottom'>
                  End date:
                </label>
                <input
                  {...register('endsAtDate', {
                    required: true,
                    valueAsDate: false,
                  })}
                  defaultValue={new Date().toLocaleDateString('en-CA')}
                  className={`inline-block align-middle ${
                    errors.endsAtDate ? 'outline-red-600' : ''
                  }`}
                  type='date'
                />
                {errors.endsAtDate && (
                  <p className='text-red-500 w-52'>
                    Please select a valid date.
                  </p>
                )}
                <input
                  {...register('endsAtTime', {
                    required: true,
                  })}
                  defaultValue={'00:00'}
                  className={`inline-block align-middle ${
                    errors.endsAtTime ? 'outline-red-600' : ''
                  }`}
                  type='time'
                />
                {errors.endsAtTime && (
                  <p className='text-red-500 w-52'>Please select a Time.</p>
                )}
              </div>

              <button
                type='submit'
                disabled={disabled}
                className='mt-7 bg-green-500 text-white font-bold text-xl px-10 py-4 rounded-xl ring-4 hover:rotate-2 hover:scale-90 hover:bg-emerald-600 focus:ring-yellow-400 focus:bg-amber-600 disabled:bg-gray-500 transition-all duration-300 ease-in'
              >
                Submit
              </button>
            </form>
          </div>
          <h1 className='text-2xl text-center font-bold mt-5 mb-5'>Preview</h1>
          {preview !== undefined ? (
            <div className='flex flex-col items-center'>
              <Offer offer={preview} />
              <button
                disabled={disabled}
                className='mt-7 bg-cyan-500 text-white font-bold text-xl px-10 py-4 rounded-xl ring-4 hover:rotate-2 hover:scale-90 hover:bg-emerald-600 focus:ring-yellow-400 focus:bg-amber-600 disabled:bg-gray-500 transition-all duration-300 ease-in'
                onClick={(): void => setShow(true)}
              >
                Upload
              </button>
              <Modal
                setShow={setShow}
                show={show}
                title='Create offer?'
              >
                <button
                  className='text-white text-semibold text-lg bg-red-600 rounded-lg ring-2 p-3 inline-block align-middle mr-3'
                  onClick={(): void => setShow(false)}
                >
                  Cancel
                </button>
                <button
                  className='text-white text-semibold text-lg bg-green-600 rounded-lg ring-2 p-3 inline-block align-middle'
                  onClick={createOffer}
                >
                  Confirm
                </button>
              </Modal>
            </div>
          ) : (
            <p className='text-center text-xl font-semibold'>
              Fill all the fields and click on the submit button when it's
              green.
            </p>
          )}
        </div>
      </Layout>
      {message.title !== '' && message.description !== '' && (
        <Toast data={message} />
      )}
    </>
  );
};

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

export default Create;
