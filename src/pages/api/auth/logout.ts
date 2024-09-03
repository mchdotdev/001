/* eslint-disable @typescript-eslint/indent */
import { NextApiRequest, NextApiResponse } from 'next';
import type { Data } from '@/lib/types';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { logout } from '@/lib/Helpers/Methods/user';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): void {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: getReasonPhrase(StatusCodes.BAD_REQUEST),
    });
    return;
  }
  return logout(res);
}
