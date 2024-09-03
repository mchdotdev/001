import { useEffect, RefObject } from 'react';

export const useOutsideAlerter = (
	ref: RefObject<HTMLElement>,
	cb: () => void,
): void => {
	useEffect(() => {
		const handleClickOutside = (event: Event): void => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				cb();
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return (): void => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [cb, ref]);
};
