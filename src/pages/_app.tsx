/* eslint-disable @typescript-eslint/indent */
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import PageWithTransition from '@/components/PageWithTransition';

export default function App(props: AppProps): JSX.Element {
  return <PageWithTransition {...props} />;
}
