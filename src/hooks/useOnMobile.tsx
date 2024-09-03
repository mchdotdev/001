/* eslint-disable @typescript-eslint/indent */
import { useState, useEffect } from 'react';

export const useOnMobile = (): boolean | null => {
  if (typeof window !== 'undefined') {
    const [width, setWidth] = useState<number>(window?.innerWidth);

    useEffect(() => {
      window.addEventListener('resize', () => setWidth(window.innerWidth));
      return () => {
        window.removeEventListener('resize', () => setWidth(window.innerWidth));
      };
    }, []);

    return width <= 768;
  }
  return null;
};
