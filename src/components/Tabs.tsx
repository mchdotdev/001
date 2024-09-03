/* eslint-disable @typescript-eslint/indent */
import { useState, MutableRefObject, FC, useEffect } from 'react';

export interface ITabItem {
  name: string;
  elementRef: MutableRefObject<HTMLElement | undefined>;
}

export interface Props {
  items: ITabItem[];
  tw?: string;
}

const Tabs: FC<Props> = ({ items, tw }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    items.map((item, i) => {
      if (active === i) {
        item.elementRef.current?.classList.remove('hidden');
      } else {
        item.elementRef.current?.classList.add('hidden');
      }
    });
  }, [active]);
  return (
    <div className={tw}>
      <div className='flex flex-row justify-start space-x-5'>
        {items.map((item, i) => {
          return (
            <h1
              key={i}
              className={`cursor-pointer hover:scale-90 hover:underline hover:animate-none transition-all duration-500 ease-in-out font-bold text-black text-xl ${
                i === active ? 'underline' : ''
              }`}
              onClick={(): void => setActive(i)}
            >
              {item.name}
              {i !== active && (
                <span
                  key={i}
                  className='animate-pulse w-3 h-3 bg-red-700 rounded-full float-left'
                ></span>
              )}
            </h1>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
