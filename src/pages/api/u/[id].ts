/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session, UserRoles, type Data, type UserDocument } from '@/lib/types';
import { User } from '@/lib/Models/User';
import { Logger } from '@/lib/Helpers/Logging/Logger';
import dbConnect from '@/lib/Helpers/Methods/dbConnect';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import {
  getServerSession,
  isLoggedIn,
  isOwner,
  logout,
  mutateSession,
} from '@/lib/Helpers/Methods/user';
import { comparePassword, createPassword } from '@/lib/Helpers/Methods/user';

dbConnect();
const logger = new Logger('API/USERS/[ID]');

const checkIsSessionUser = (
  session: Session,
  user: UserDocument,
  res: NextApiResponse,
): void => {
  if (session!._id.toString() !== user._id.toString()) {
    res.status(StatusCodes.FORBIDDEN).json({
      error: true,
      message: getReasonPhrase(StatusCodes.FORBIDDEN),
    });
    return;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<UserDocument | null>>,
): Promise<void> {
  const id = req.query.id as string;
  if (id.length !== 4 || isNaN(parseInt(id)) || parseInt(id) > 10000) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Invalid userId',
    });
    return;
  }
  let user = await User.findOne({ userId: parseInt(id) });

  if (!user) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: true,
      message: getReasonPhrase(StatusCodes.NOT_FOUND),
      data: null,
    });
    return;
  }
  switch (req.method) {
    case 'GET':
      {
        res
          .status(user !== null ? StatusCodes.OK : StatusCodes.NOT_FOUND)
          .json({
            error: user === null,
            message: user !== null ? 'User found.' : 'User not found.',
            data: user !== null ? user : null,
          });
      }

      break;

    case 'PUT':
      {
        const session = getServerSession(req);
        if (!isLoggedIn(session)) {
          logger.debug('Unauthorized attempt to edit user.');
          res.status(StatusCodes.UNAUTHORIZED).json({
            error: true,
            message: 'Unauthorized.',
          });
          return;
        }
        const { name, role, email, phoneNumber, oldPassword, newPassword } =
          req.body as {
            name: string;
            role: UserRoles;
            email: string;
            phoneNumber: string;
            oldPassword: string;
            newPassword: string;
          };
        logger.debug(`Got body:\n${JSON.stringify(req.body, null, 2)}`);
        if (typeof role !== 'undefined') {
          if (!isOwner(session)) {
            res.status(StatusCodes.FORBIDDEN).json({
              error: true,
              message: 'Only a developer or the owner can execute this action',
            });
            return;
          }
          try {
            user.role = Number(role);
            await user.save();
            if (session!._id.toString() === user._id.toString())
              mutateSession({ ...session!, role: Number(role) }, res);
            logger.debug('User role edited successfully!');
            res.status(StatusCodes.OK).json({
              error: false,
              message: 'User role edited successfully!',
            });
            return;
          } catch (error) {
            logger.error(
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to edit user role for ' + id,
            );
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
              error: true,
              message:
                error instanceof Error
                  ? error.message
                  : 'An error has occurred trying to edit user role for ' + id,
            });
            return;
          }
        } else {
          checkIsSessionUser(session, user, res);
          if (name) {
            try {
              user.name = name;
              await user.save();
              mutateSession(
                {
                  ...session!,
                  name,
                },
                res,
              );
              logger.debug('User name edited successfully!');
              res.status(StatusCodes.OK).json({
                error: false,
                message: 'User name edited successfully!',
              });
              return;
            } catch (error) {
              logger.error(
                error instanceof Error
                  ? error.message
                  : 'An error has occurred trying to edit user name for ' + id,
              );
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: true,
                message:
                  error instanceof Error
                    ? error.message
                    : 'An error has occurred trying to edit user name for ' +
                      id,
              });
              return;
            }
          }
          if (phoneNumber) {
            if (
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g.test(
                phoneNumber,
              ) === false
            ) {
              return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Invalid phone number',
              });
            }
            try {
              user.phoneNumber = phoneNumber;
              await user.save();
              logger.debug('User phone number edited successfully!');
              res.status(StatusCodes.OK).json({
                error: false,
                message: 'User phone number edited successfully!',
              });
              return;
            } catch (error) {
              logger.error(
                error instanceof Error
                  ? error.message
                  : 'An error has occurred trying to edit user phone number for ' +
                      id,
              );
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: true,
                message:
                  error instanceof Error
                    ? error.message
                    : 'An error has occurred trying to edit user phone number for ' +
                      id,
              });
              return;
            }
          }
          if (email) {
            if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email) === false) {
              return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message: 'Invalid email',
              });
            }
            try {
              user.email = email;
              await user.save();
              logger.debug('User email edited successfully!');
              res.status(StatusCodes.OK).json({
                error: false,
                message: 'User email edited successfully!',
              });
              return;
            } catch (error) {
              logger.error(
                error instanceof Error
                  ? error.message
                  : 'An error has occurred trying to edit user email for ' + id,
              );
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: true,
                message:
                  error instanceof Error
                    ? error.message
                    : 'An error has occurred trying to edit user email for ' +
                      id,
              });
              return;
            }
          }
          if (oldPassword && newPassword) {
            user = await User.findOne({ userId: parseInt(id) })
              .select('+password')
              .exec();
            const isCorrectOldPass = await comparePassword(
              oldPassword,
              user!.password,
            );
            if (isCorrectOldPass === false) {
              logger.debug('Incorrect old password');
              return res.status(StatusCodes.BAD_REQUEST).json({
                error: true,
                message:
                  'Incorrect old password, please ask a website admin to change your password for you.',
              });
            }
            try {
              const newPass = await createPassword(newPassword);
              user!.password = newPass;
              await user!.save();
              logger.debug('User password edited successfully!');
              res.status(StatusCodes.OK).json({
                error: false,
                message: 'User password edited successfully!',
              });
              return;
            } catch (error) {
              logger.error(
                error instanceof Error
                  ? error.message
                  : 'An error has occurred trying to edit user password for ' +
                      id,
              );
              res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: true,
                message:
                  error instanceof Error
                    ? error.message
                    : `An error has occurred trying to edit user password for ${
                        user!.name
                      }, please ask a website admin to change your password for you.`,
              });
              return;
            }
          }
        }
      }
      break;

    case 'DELETE':
      {
        const session = getServerSession(req);
        if (
          !isLoggedIn(session) ||
          (isLoggedIn(session) &&
            session!._id.toString() !== user._id.toString())
        ) {
          res.status(StatusCodes.FORBIDDEN).json({
            error: true,
            message: getReasonPhrase(StatusCodes.FORBIDDEN),
          });
          return;
        }
        logger.info(`Deleting account for ${user._id}...`);
        try {
          await user.deleteOne();
          logout(res);
          res.status(StatusCodes.OK).json({
            error: false,
            message: 'Account deleted',
          });
          return;
        } catch (error) {
          logger.error(
            error instanceof Error
              ? error.message
              : 'An error has occurred trying to delete user',
          );
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: true,
            message:
              error instanceof Error
                ? error.message
                : 'An error has occurred trying to delete user',
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
