/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Logger } from '../../Logging/Logger';
import type { Data, SessionUserData } from '@/lib/types';
import { comparePassword } from '../../Methods/user';
import { User } from '@/lib/Models/User';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { serialize } from 'cookie';
import { sign } from 'jsonwebtoken';

export const login = async (
  req: NextApiRequest & {
    body: {
      email: string;
      password: string;
    };
  },
  res: NextApiResponse<Data<null>>,
  logger: Logger,
  // eslint-disable-next-line require-await
): Promise<void> => {
  if (req.method !== 'POST') {
    logger.debug('Invalid method');
    res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
      error: true,
      message: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
    });
    return;
  }
  if (Object.keys(req.body).length === 0) {
    logger.debug('Empty body');
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Empty body',
    });
    return;
  }
  const { email, password } = req.body;
  logger.debug('Getting user...');
  try {
    const user = await User.findOne({ email }).select('+password').exec();
    if (user === null) {
      logger.debug(`User with the email ${email} was not found.`);
      res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: `User with the email ${email} was not found.`,
      });
      return;
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      logger.debug('Wrong password.');
      res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: 'Wrong password.',
      });
      return;
    }
    logger.debug('All test cases have passed. Signing JWT token');
    const payload: SessionUserData = {
      name: user.name,
      userId: user.userId,
      avatar: user.avatar,
      _id: user._id,
      lastUpdatedTimestamp: Date.now(),
      createdAt: user.createdAt,
      email: user.email,
      role: user.role,
    };
    const token = sign(payload, process.env.JWT_KEY, {
      expiresIn: 60 * 60 * 24,
    });
    const serialized = serialize(process.env.COOKIE_NAME, token, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
    });
    res.setHeader('Set-Cookie', serialized);
    res.status(StatusCodes.OK).json({
      error: false,
      message: 'Logged in successfully',
    });
    return;
  } catch (error) {
    logger.error(
      `Login error:  ${error instanceof Error ? error.message : error}`,
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    });
    return;
  }
};
