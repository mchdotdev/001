import { FC } from 'react';
import { useMetaData } from '@/hooks/useMetaData';
import { Session } from '@/lib/types';
import Layout from './Layout';

interface Props {
	session: Session;
	path: string;
	error: string;
}

const NotFound: FC<Props> = ({ path, session, error }) => {
	return (
		<>
			{useMetaData('Resource not found', path, 'Resource not found')}
			<Layout session={session}>
				<div className='flex flex-col items-center justify-center h-screen'>
					<div className='animate-run animate-shake h-44 w-44 rounded-full bg-gradient-to-r from-yellow-400 to-gray-600 flex flex-col items-center justify-center'>
						<div className='h-40 w-40 rounded-full bg-white flex flex-col items-center justify-center animate-shake'>
							<div className='w-4 h-6 bg-gradient-to-t from-yellow-400 to-amber-500'></div>
							<div className='w-4 h-14 bg-gradient-to-b from-yellow-400 to-amber-500 mt-5'></div>
						</div>
					</div>
					<h1 className='my-10 text-2xl font-bold'>
						The resource that you were looking for was not found!
					</h1>
					<p className='mb-7 font-semibold text-lg italic'>
						(Error message: {error})
					</p>
					<button
						className='text-lg bg-emerald-500 p-4 rounded-xl ring-4 ring-green-300 text-white font-semibold hover:-rotate-3 hover:scale-105 transition-all duration-500 ease-in-out focus:bg-green-600'
						onClick={(): void => window.history.back()}
					>
						Go back
					</button>
				</div>
			</Layout>
		</>
	);
};

export default NotFound;
