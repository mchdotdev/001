/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Data, UserDocument, UserRoles } from '@/lib/types';
import { User } from '@/lib/Models/User';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { StatusCodes } from 'http-status-codes';
import { getServerSession, isAdmin } from '@/lib/Helpers/Methods/user';

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<UserDocument[] | null>>,
): Promise<void> {
  const session = getServerSession(req);
  if (!isAdmin(session)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: true,
      message: 'Unauthorized.',
    });
  }
  switch (req.method) {
    case 'GET':
      {
        const options = {
          page: parseInt(req.query.page as string) || 0,
          limit: parseInt(req.query.limit as string) || 10,
          query: req.query.search as string,
        };
        if (options.query && options.query === 'admins') {
          const admins = await User.find({
            $or: [
              { role: UserRoles.ADMIN },
              { role: UserRoles.OWNER },
              { role: UserRoles.DEVELOPER },
            ],
          });
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Admins found.',
            data: admins,
          });
          return;
        }
        if (options.query && options.query === 'all') {
          const allUsers = await User.find().sort('desc').exec();
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Users found.',
            data: allUsers,
          });
          return;
        }
        const users = await User.find()
          .sort('desc')
          .skip(options.page * options.limit)
          .limit(options.limit)
          .exec();
        res.status(StatusCodes.OK).json({
          error: false,
          message: 'Users found.',
          data: users,
        });
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
