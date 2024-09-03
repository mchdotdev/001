/* eslint-disable @typescript-eslint/indent */
export const truncate = (text: string): string => {
  return text.length > 16 ? text.slice(0, 13) + '...' : text;
};
