/* eslint-disable @typescript-eslint/indent */
import { useEffect, useState } from 'react';

export const useCountdown = (
  targetDate: number,
): ReturnType<typeof getReturnValues> => {
  const [countDown, setCountDown] = useState(targetDate - Date.now());
  const [time, setTime] = useState<[number, number, number, number, number]>([
    0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    if (countDown < 1000) return;
    const interval = setInterval(() => {
      setCountDown(countDown - 1000);
      setTime(getReturnValues(countDown));
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  return time!;
};

const getReturnValues = (
  countDown: number,
): [number, number, number, number, number] => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [countDown, days, hours, minutes, seconds];
};
