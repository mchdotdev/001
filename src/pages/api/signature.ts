/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data } from '@/lib/types';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import { v2 as cloudinary } from 'cloudinary';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';

interface ResData {
  signature: string;
  timestamp: number;
  key: string;
}

const logger = new Logger('API/SIGNATURE');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const allowedFolders = ['avatar', 'gallery'] as const;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<ResData>>,
): void {
  if (req.method !== 'GET') {
    res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      error: true,
      message: 'Method not allowed.',
    });
    return;
  }
  const session = getServerSession(req);
  if (!isAdmin(session)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: true,
      message: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    });
    return;
  }
  const folder = req.query.folder as (typeof allowedFolders)[number];
  if (!allowedFolders.includes(folder)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Folder not allowed.',
    });
    return;
  }
  const timestamp = Math.round(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: `power-gym/${folder}`,
      transformation: 'q_auto:good,f_auto,fl_lossy',
    },
    process.env.CLOUDINARY_SECRET,
  );
  logger.info('Generaterd signature successfully!');
  res.status(StatusCodes.OK).json({
    error: false,
    message: 'Signature generated.',
    data: {
      signature,
      timestamp,
      key: process.env.CLOUDINARY_KEY,
    },
  });
}
