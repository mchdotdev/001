/**
 *
 * @param fn callback function
 * @param cooldown time to wait before function execution
 * @returns timeout
 */

export function throttle<Args extends unknown[]>(
	fn: (...args: Args) => void,
	cooldown = 3000,
): (...args: Args) => void | NodeJS.Timeout {
	let lastArgs: Args | undefined;
	const run = (): void => {
		if (lastArgs) {
			fn(...lastArgs);
			lastArgs = undefined;
		}
	};

	return (...args: Args): void | NodeJS.Timeout => {
		const onCooldown = !!lastArgs;
		lastArgs = args;
		if (!onCooldown) return;
		setTimeout(run, cooldown);
	};
}
