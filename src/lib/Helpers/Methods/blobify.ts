/**
 * Convert a file URL into a blob URL
 * @param url The URL of the file to convert
 * @returns blob URL of file
 */

export const blobify = async (url: string): Promise<string> => {
	const res = await fetch(url);
	const blob = await res.blob();
	return URL.createObjectURL(blob);
};
