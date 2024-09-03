/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRoles, type Data } from '@/lib/types';
import { User } from '@/lib/Models/User';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';
import { Logger } from '@/lib/Helpers/Logging/Logger';

dbConnect();

const logger = new Logger('/API/ADMIN/UNVERIFY');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<null>>,
): Promise<void> {
  const session = getServerSession(req);
  if (!isAdmin(session))
    return res.status(StatusCodes.FORBIDDEN).json({
      error: true,
      message: getReasonPhrase(StatusCodes.FORBIDDEN),
    });
  switch (req.method) {
    case 'PUT':
      {
        if (Object.keys(req.body).length !== 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: '`body` is missing the `id` property',
          });
        }
        const id = parseInt(req.body.id as string);
        logger.debug(`got ID: ${id}`);

        const user = await User.findOne({ userId: id });
        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({
            error: true,
            message: 'User not found',
          });
        }
        if (user.role > session!.role || session!.role < UserRoles.OWNER)
          return res.status(StatusCodes.FORBIDDEN).json({
            error: true,
            message: getReasonPhrase(StatusCodes.FORBIDDEN),
          });
        if (!user.verified)
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: 'User is already unverified',
          });

        try {
          user.verified = false;
          await user.save();
          logger.debug(`Unverified user ${user.name} (${user.userId})`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Unverified successfully',
          });
          return;
        } catch (error) {
          logger.error(
            `An error occured trying to unverify user\nUser's info: ${
              user.name
            } ${user.userId}\n ${
              error instanceof Error ? error.message : error
            }`,
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: `An error occured trying to unverify user: ${
              error instanceof Error ? error.message : error
            }`,
          });
        }
      }

      break;

    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        error: true,
        message: 'Method not allowed.',
      });
      break;
  }
}
