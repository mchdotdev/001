/**
 * Removes special regex characters from a string
 * @param text string
 * @returns string with escaped characters
 */

export const escapeRegex = (text: string): string => {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
