/* eslint-disable @typescript-eslint/indent */
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Logger } from '../../Logging/Logger';
import type { Data } from '@/lib/types';
import { User } from '@/lib/Models/User';
import { JwtPayload, verify } from 'jsonwebtoken';
import { createPassword } from '../../Methods/user';
import { StatusCodes } from 'http-status-codes';
import { userDataSchema } from '@/lib/Schemas/user';
import { z } from 'zod';
import { generateId } from '../../Methods/user';

export const activate = async (
  req: NextApiRequest & {
    query: {
      token: string;
    };
  },
  res: NextApiResponse<Data>,
  logger: Logger,
  // eslint-disable-next-line require-await
): Promise<void> => {
  const token = req.query.token;
  if (!token) {
    logger.debug('Missing token.');
    res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: 'Missing token',
    });
    return;
  }
  logger.debug(`Token: ${token}`);
  try {
    const data = (await verify(token, process.env.JWT_KEY)) as JwtPayload;
    logger.debug('Validating data...');
    delete data.iat;
    delete data.exp;
    if (!userDataSchema.safeParse(data).success) {
      logger.debug('Data validation failed.');
      res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: 'Invalid Data',
      });
      return;
    }
    logger.debug(`Data: ${JSON.stringify(data, null, 4)}`);
    const { name, email, password, phoneNumber } = data as z.infer<
      typeof userDataSchema
    >;
    logger.debug('Creating password...');
    const safePass = await createPassword(password);
    logger.debug('Creating User document...');
    const user = new User({
      name,
      email,
      password: safePass,
      phoneNumber,
    });
    let userId = generateId(4);

    // Check if a user with the same generated ID exists, if so, make a new one.

    while ((await User.findOne({ userId })) !== null) userId = generateId(4);

    user.userId = userId;
    await user.save();
    logger.info(`User [${user._id}] document was saved`);
    res.redirect('/auth/login');
  } catch (error) {
    logger.error(
      `${
        error instanceof Error ? error.message : 'Failed to activate account'
      }`,
    );
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: `${
        error instanceof Error ? error.message : 'Failed to activate account'
      }`,
    });
  }
};
