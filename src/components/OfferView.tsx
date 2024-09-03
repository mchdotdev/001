/* eslint-disable @typescript-eslint/indent */
import { FC } from 'react';
import { OfferDocument, Session, UserRoles, Data } from '@/lib/types';
import { useState } from 'react';
import IconButton from './IconButton';
import Modal from './Modal';
import Toast, { ToastOptions, clearMessage } from './Toast';

interface Props {
  session: Session;
  offer: OfferDocument;
}

const getStatus = (endDate: number): 'Available' | 'Expired' => {
  return endDate - Date.now() > 0 ? 'Available' : 'Expired';
};

const OfferView: FC<Props> = ({ offer, session }) => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [edited, setEdited] = useState<{ title: string; description: string }>({
    title: offer.title,
    description: offer.description,
  });
  const [message, setMessage] = useState<ToastOptions>({
    type: 'info',
    title: '',
    description: '',
  });
  const status = getStatus(offer.endsAt);

  const editOffer = async (): Promise<void> => {
    setShow1(false);
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Editing offer',
    });
    const res = await fetch(`/api/offers/${offer._id}`, {
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
        description: 'Offer edited successfully!',
      });
      clearMessage(setMessage, 5000);
      setTimeout(() => {
        window.location.reload();
      }, 5001);
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

  const deleteOffer = async (): Promise<void> => {
    setShow2(false);
    setMessage({
      type: 'loading',
      title: 'Loading...',
      description: 'Deleting offer',
    });
    const res = await fetch(`/api/offers/${offer._id}`, {
      method: 'DELETE',
    });
    const response = (await res.json()) as Data;
    clearMessage(setMessage);
    if (res.ok) {
      setMessage({
        type: 'success',
        title: 'Success!',
        description: 'Offer deleted successfully!',
      });
      clearMessage(setMessage, 5000);
      setTimeout(() => {
        window.location.href = '/offers';
      }, 5001);
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
    <div className='flex flex-col items-center'>
      <div
        className='cursor-pointer mb-10 h-auto w-full bg-no-repeat bg-center flex flex-col items-start p-20 rounded-2xl bg-cover text-black border-2'
        style={{ backgroundImage: `url(${offer.image})` }}
      >
        <div className='bg-gray-400 bg-opacity-50 p-8'>
          <h1 className='text-3xl font-bold hover:translate-x-4 transition-all duration-300 ease-in-out mb-3 text-center sm:text-start'>
            {offer.title}
          </h1>
          <p className='text-xl font-bold mb-4 text-center sm:text-start'>
            {offer.description}
          </p>
          <div className='flex flex-col sm:flex-row font-semibold mb-10 items-center mx-auto sm:mx-0 text-white text-stroke'>
            <p className='mr-2'>Starts at: </p>
            <p className='w-auto h-auto p-2 rounded-lg font-bold bg-gradient-to-r from-amber-400 to-violet-600 cursor-pointer hover:scale-90 transition-all duration-500 ease-linear'>
              {new Date(offer.startsAt).toLocaleDateString()}{' '}
              {new Date(offer.startsAt).toLocaleTimeString()}
            </p>
          </div>
          <div className='flex flex-col sm:flex-row font-semibold items-center mx-auto sm:mx-0 text-white text-stroke'>
            <p className='mr-2'>Ends at: </p>
            <p className='w-auto h-auto p-2 rounded-lg font-bold bg-gradient-to-r from-amber-400 to-violet-600 cursor-pointer hover:scale-90 transition-all duration-500 ease-linear'>
              {new Date(offer.endsAt).toLocaleDateString()}{' '}
              {new Date(offer.endsAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className='mt-10 flex flex-row items-center space-x-5'>
          <h1 className='text-xl font-bold'>Status:</h1>
          <p
            className={`text-center w-32 h-auto rounded-lg text-white p-2 ring-2 ${
              status === 'Available'
                ? 'bg-green-500 ring-emerald-200'
                : 'bg-red-500 ring-red-300'
            }`}
          >
            {status}
          </p>
        </div>
      </div>
      {session && session.role >= UserRoles.ADMIN && (
        <div className='mt-10 flex flex-row items-center justify-center space-x-10'>
          <IconButton
            icon='edit'
            title='Edit offer'
            className='bg-slate-400 w-10 h-10 rounded-lg'
            onClick={(): void => setShow1(true)}
          />
          <IconButton
            icon='delete'
            title='Delete offer'
            className='bg-red-400 w-10 h-10 rounded-lg'
            onClick={(): void => setShow2(true)}
          />
        </div>
      )}
      <Modal
        title='Edit Offer'
        show={show1}
        setShow={setShow1}
      >
        <div className='flex flex-col mb-10 font-semibold'>
          <label className='text-xl font-bold mb-3'>Title</label>
          <textarea
            minLength={10}
            maxLength={50}
            className='resize w-64 pt-1 pl-1'
            value={edited.title}
            onChange={(e): void =>
              setEdited({ ...edited, title: e.target.value })
            }
          />
        </div>
        <div className='flex flex-col mb-10 font-semibold'>
          <label className='text-xl font-bold mb-3'>Description</label>
          <textarea
            minLength={10}
            maxLength={100}
            className='resize w-80 pt-1 pl-1'
            value={edited.description}
            onChange={(e): void =>
              setEdited({ ...edited, description: e.target.value })
            }
          />
        </div>
        <button
          onClick={editOffer}
          disabled={
            edited.title.length < 10 ||
            edited.title.length > 50 ||
            edited.description.length < 10 ||
            edited.description.length > 100
          }
          className='p-3 px-5 rounded-lg bg-green-500 text-white font-semibold text-lg ring-2 ring-emerald-300 disabled:bg-gray-400 disabled:ring-gray-700 hover:scale-90 transition-all duration-300 ease-out'
        >
          Edit
        </button>
      </Modal>
      <Modal
        title='Are you sure you want to delete this offer?'
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
          onClick={deleteOffer}
        >
          Confirm
        </button>
      </Modal>
      {message.title !== '' && message.description !== '' && (
        <Toast data={message} />
      )}
    </div>
  );
};

export default OfferView;
