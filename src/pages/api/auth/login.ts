/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { login } from '@/lib/Helpers/Auth/Controllers/login';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import type { Data, SessionUserData } from '@/lib/types';

dbConnect();
const logger = new Logger('API/AUTH/LOGIN');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<SessionUserData | null>>,
): Promise<void> {
  if (req.method === 'POST') await login(req, res, logger);
  else
    res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      error: true,
      message: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
    });
}
