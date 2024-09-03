/* eslint-disable @typescript-eslint/indent */
import Link from 'next/link';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useOutsideAlerter } from '../hooks/useOutsideAlerter';

export interface IDropdownItem {
  text: string;
  href?: string;
  cb?: () => void;
  tw?: string; // the style of the items
}

export interface DropdownProps {
  direction: 'right' | 'left' | 'bottom';
  children: ReactNode;
  items: IDropdownItem[];
  newSpace?: boolean;
  tw?: string; // the style of the whole list of items
  hovered?: boolean; // if true, the dropdown is active on hover
}

const Dropdown = ({
  direction,
  children,
  items,
  newSpace,
  tw,
  hovered,
}: DropdownProps): JSX.Element => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = (): void => {
    setIsVisible(!isVisible);
  };
  useOutsideAlerter(dropdownRef, () => setIsVisible(false));

  useEffect(() => {
    if (hovered) {
      dropdownRef.current?.addEventListener('mouseover', () =>
        setIsVisible(true),
      );
      dropdownRef.current?.addEventListener('mouseleave', () =>
        setIsVisible(false),
      );
      return () => {
        dropdownRef.current?.removeEventListener('mouseover', () =>
          setIsVisible(true),
        );
        dropdownRef.current?.removeEventListener('mouseleave', () =>
          setIsVisible(false),
        );
      };
    }
  }, []);

  return (
    <div
      className={`relative z-10 ${
        direction === 'right'
          ? 'flex flex-row'
          : direction === 'left'
          ? 'flex flex-row-reverse'
          : direction === 'bottom'
          ? 'relative inline-block'
          : ''
      }`}
      ref={dropdownRef}
    >
      <button onClick={toggleVisibility}>{children}</button>
      {isVisible && (
        <div
          className={`${
            newSpace ? 'relative' : 'absolute'
          } ${tw} flex flex-col rounded-md drop-shadow-lg child-xl cursor-pointer min-w-full`}
        >
          {items.map((item, i) => {
            return (
              <DropdownItem
                href={item.href}
                text={item.text}
                key={i}
                tw={item.tw}
                cb={item.cb}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ text, href, tw, cb }: IDropdownItem): JSX.Element => {
  return (
    <>
      <div
        className={`${tw} py-2 flex flex-wrap px-2 border-gray-200 border-b-2 bg-white text-black hover:underline`}
        onClick={
          href
            ? (): string => (window.location.href = href)
            : typeof cb !== 'undefined'
            ? (): void => cb()
            : (): boolean => {
                return false;
                // eslint-disable-next-line no-mixed-spaces-and-tabs
              }
        }
      >
        {typeof href !== 'undefined' && <Link href={href!}>{text}</Link>}
        {typeof href === 'undefined' && <p>{text}</p>}
      </div>
    </>
  );
};

export default Dropdown;
