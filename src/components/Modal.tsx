/* eslint-disable @typescript-eslint/indent */
import { FC, ReactNode, useRef, Dispatch, SetStateAction } from 'react';
import { useOutsideAlerter } from '../hooks/useOutsideAlerter';

interface Props {
  children: ReactNode;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  title: string;
  tw?: string;
  onClose?: () => void;
}

const Modal: FC<Props> = ({ children, show, setShow, title, tw, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const close = () => {
    setShow(false);
    if (typeof onClose !== 'undefined') onClose();
  };
  useOutsideAlerter(modalRef, close);
  if (!show) {
    return null;
  }
  return (
    <div
      className='fixed left-0 right-0 top-0 bottom-0 flex items-center justify-center z-50 overflow-y-scroll'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className='container overflow-y-scroll w-auto h-auto bg-gray-200 rounded-xl shadow-xl pt-8 pb-8 text-black'
        ref={modalRef}
      >
        <button
          onClick={close}
          className='float-right -mt-5'
        >
          &#10006;
        </button>
        <h1 className='text-xl font-bold'>{title}</h1>
        <br />
        <div className={tw}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
