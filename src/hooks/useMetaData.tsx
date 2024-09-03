/* eslint-disable @typescript-eslint/indent */
import { JSX } from 'react';
import Head from 'next/head';

export const useMetaData = (
  title: string,
  url: string,
  description = 'Power Gym website',
): JSX.Element => {
  return (
    <Head>
      <title>{`Power Gym | ${title}`}</title>
      <meta charSet='utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1'
      />
      <meta
        name='description'
        content={description}
      />
      <link
        rel='shortcut icon'
        href='/assets/logo.png'
        type='image/png'
      />
      <meta
        property='og:title'
        content={`Power Gym | ${title}`}
      />
      <meta
        property='og:description'
        content={description}
      />
      <meta
        property='og:type'
        content='website'
      />
      <meta
        property='og:url'
        content={process.env.NEXT_PUBLIC_URL + url}
      />
      <meta
        property='og:image'
        content='/assets/logo.png'
      />
      <meta
        name='keywords'
        color='gym, Gym, fitness, power gym, Power Gym, gym, bodybuilding '
      />
      <meta
        content='#dee610'
        data-react-helmet='true'
        name='theme-color'
      />
    </Head>
  );
};
