/* eslint-disable @typescript-eslint/indent */
import { FC, MutableRefObject } from 'react';
import type { Data, ViewDocument } from '@/lib/types';
import Modal from './Modal';
import { useState, useRef, Dispatch, SetStateAction, useEffect } from 'react';
import { clearMessage, ToastOptions } from './Toast';
import Tabs from './Tabs';

interface Props {
  viewsRef: MutableRefObject<HTMLDivElement>;
  views: ViewDocument[] | null;
  setMessage: Dispatch<SetStateAction<ToastOptions>>;
}

const ViewsMetricsSection: FC<Props> = ({ viewsRef, views, setMessage }) => {
  if (views !== null) {
    const [show, setShow] = useState(false);

    const allRef = useRef<HTMLDivElement>(undefined!);
    const offersRef = useRef<HTMLDivElement>(undefined!);
    const mappedViews: Record<string, number> = {};

    views.forEach((v) => {
      if (mappedViews[v.routeVisited]) {
        mappedViews[v.routeVisited] = mappedViews[v.routeVisited] + v.count;
        return;
      }
      mappedViews[v.routeVisited] = v.count;
    });

    const purge = async (): Promise<void> => {
      setShow(false);
      setMessage({
        type: 'loading',
        title: 'Loading',
        description: 'Deleting data',
      });
      const resp = await fetch('/api/views?all=true', {
        method: 'DELETE',
      });
      const res = (await resp.json()) as Data;
      if (!resp.ok) {
        setMessage({
          type: 'error',
          title: 'Error',
          description: res.message,
        });
        clearMessage(setMessage, 5000);
        return;
      }
      setMessage({
        type: 'success',
        title: 'Success',
        description: res.message,
      });
      clearMessage(setMessage, 5000);
      setTimeout(() => {
        window.location.reload();
      }, 5001);
      return;
    };

    return (
      <div ref={viewsRef}>
        <h1 className='text-xl font-bold mt-10'>
          Most visited page:{' '}
          <span className='font-bold text-gray-400 text-md'>
            {Object.keys(mappedViews).find(
              (k) => mappedViews[k] === Math.max(...Object.values(mappedViews)),
            )}
          </span>{' '}
          with{' '}
          <span className='font-bold text-slate-400 text-md'>
            {Math.max(...Object.values(mappedViews))}
          </span>{' '}
          visits
        </h1>
        <div className='flex flex-row items-center mt-4'>
          <button
            className='p-4 bg-red-500 text-white font-bold text-lg rounded-lg border-2 border-red-300 hover:translate-x-2 transition-all duration-300 ease-in-out hover:rotate-2'
            onClick={(): void => setShow(true)}
          >
            Clear
          </button>
        </div>
        <Modal
          setShow={setShow}
          show={show}
          title='Are you sure you want to clear this data?'
        >
          <button
            className='text-white text-semibold text-lg bg-red-600 rounded-lg ring-2 p-3 inline-block align-middle mr-3'
            onClick={(): void => setShow(false)}
          >
            Cancel
          </button>
          <button
            className='text-white text-semibold text-lg bg-green-600 rounded-lg ring-2 p-3 inline-block align-middle'
            onClick={purge}
          >
            Confirm
          </button>
        </Modal>
        <Tabs
          items={[
            {
              name: 'All',
              elementRef: allRef,
            },
            {
              name: 'Offers',
              elementRef: offersRef,
            },
          ]}
          tw='mt-10'
        />
        <div
          className='relative overflow-x-auto shadow-md sm:rounded-lg mt-10'
          ref={allRef}
        >
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3'
                >
                  Route
                </th>
                <th
                  scope='col'
                  className='px-6 py-3'
                >
                  Visits
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(mappedViews).map((v, i) => {
                return (
                  <tr
                    key={i}
                    className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                  >
                    <th
                      scope='row'
                      className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer'
                      onClick={(): string => (window.location.href = v)}
                    >
                      {v === '/' ? 'home page' : v}
                    </th>
                    <td className='px-6 py-4'>{mappedViews[v]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className='relative overflow-x-auto shadow-md sm:rounded-lg mt-10'
          ref={offersRef}
        >
          <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3'
                >
                  Route
                </th>
                <th
                  scope='col'
                  className='px-6 py-3'
                >
                  Visits
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(mappedViews)
                .filter((el) => el.startsWith('/offers'))
                .map((v, i) => {
                  return (
                    <tr
                      key={i}
                      className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'
                    >
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer'
                        onClick={(): string => (window.location.href = v)}
                      >
                        {v === '/' ? 'home page' : v}
                      </th>
                      <td className='px-6 py-4'>{mappedViews[v]}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div
      ref={viewsRef}
      className='mt-10'
    >
      <h1 className='text-center text-2xl font-bold'>No Data</h1>
    </div>
  );
};

export default ViewsMetricsSection;
