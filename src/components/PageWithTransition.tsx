import { useState, useEffect, useRef } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

const PageWithTransition = ({
	Component,
	pageProps,
}: AppProps): JSX.Element => {
	const router = useRouter();
	const prevScreen = useRef(Component);
	const [transitioning, setTransitioning] = useState(false);

	useEffect(() => {
		const handler = (): void => {
			setTransitioning(true);
			setTimeout(() => {
				prevScreen.current = Component;
				setTransitioning(false);
			}, 280);
		};
		router.events.on('routeChangeComplete', handler);
		return (): void => {
			router.events.off('routeChangeComplete', handler);
		};
	}, [Component, router.events]);

	const Screen = !transitioning ? prevScreen.current : Component;

	return (
		<div
			className={
				!transitioning ? 'animate-slideUpEnter' : 'animate-slideDownLeave'
			}
		>
			<Screen {...pageProps} />
		</div>
	);
};

export default PageWithTransition;
