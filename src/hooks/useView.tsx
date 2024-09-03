/* eslint-disable @typescript-eslint/indent */
import { useEffect } from 'react';

export const useView = (route: string) => {
  useEffect(() => {
    fetch('/api/views', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        routeVisited: route,
      }),
    }).then(() => {});
  }, []);
};
