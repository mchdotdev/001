/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRoles, type Data } from '@/lib/types';
import { User } from '@/lib/Models/User';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import { createPassword } from '@/lib/Helpers/Methods/user';

dbConnect();

const logger = new Logger('/API/ADMIN/RESET');

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
        if (Object.keys(req.body).length !== 2) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: true,
            message: '`body` is missing the `password` and `id` properties',
          });
        }
        const { password, id } = req.body as { password: string; id: string };

        logger.debug(`Got: ${JSON.stringify(req.body, null, 2)}`);

        const user = await User.findOne({ userId: parseInt(id) });
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
        try {
          const newPassword = await createPassword(password);
          user.password = newPassword;
          await user.save();
          logger.debug(`Changed user ${user.name}'s password (${user.userId})`);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Reset successfully',
          });
          return;
        } catch (error) {
          logger.error(
            `An error occured trying to reset user's password\nUser info:${
              user.name
            } ${user.userId}: ${
              error instanceof Error ? error.message : error
            }`,
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message: `An error occured trying to reset user's password: ${
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
